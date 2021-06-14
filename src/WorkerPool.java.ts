import cluster, { Worker as WorkerProcess } from "cluster"
import AsyncEventEmitter from "./lib/AsyncEventEmitter.java"
import Queue from "./Queue.java"
import Throttle from "./Throttle.java"
import IndexQueueRepository from "./database/repositories/IndexQueueRepository.java"
import BusyTasksHandler from "./redis/handlers/BusyTasksHandler.java"
import ResultMessage from "./structures/ResultMessage.java"
import TaskMessage from "./structures/TaskMessage.java"

export default class WorkerPool extends AsyncEventEmitter {
    private workers = new Set<WorkerProcess>()
    private workerQueue = new Queue<WorkerProcess>()
    private isSupplyingWorkers = false
    private throttle: Throttle

    constructor(props: {
        throttle: {
            iterations: number,
            timeout: number
        }
    }) {
        super()

        this.throttle = new Throttle({
            iterations: props.throttle.iterations,
            timeout: props.throttle.timeout,
            onRelease: this.supplyWorkers.bind(this)
        })

        cluster.on("exit", this.handleWorkerExit.bind(this))
        cluster.on("message", this.handleWorkerMessage.bind(this))
        cluster.on("online", this.handleWorkerOnline.bind(this))
    }

    public createWorkers(nWorkers: number) {
        for (let i = 0; i < nWorkers; i++) {
            const worker = cluster.fork()
            this.workers.add(worker)
            this.workerQueue.add(worker)
        }
    }

    private async supplyWorkers() {
        if (this.isSupplyingWorkers) {
            return
        }

        this.isSupplyingWorkers = true

        while (this.workerQueue.size() > 0) {
            if (this.throttle.isThrottled) {
                break
            }

            const worker = this.workerQueue.poll()
            if (!worker.isConnected()) {
                this.workerQueue.add(worker)
                continue
            }

            const indexQueueItem = await IndexQueueRepository.poll()
            if (!indexQueueItem) {
                this.workerQueue.putBack(worker)
                break
            }

            await BusyTasksHandler.create(indexQueueItem.url)
            const message = new TaskMessage({
                command: "master.task",
                data: indexQueueItem.url
            })
            worker.send(message)
            this.throttle.tick()
        }

        this.isSupplyingWorkers = false
    }

    private async handleWorkerOnline(worker: WorkerProcess) {
        if (!this.isOwnWorker(worker)) {
            return
        }
        this.supplyWorkers()
    }

    private async handleWorkerMessage(worker: WorkerProcess, rawMessage: ResultMessage) {
        if (!this.isOwnWorker(worker)) {
            return
        }
        const message = new ResultMessage(rawMessage)
        await BusyTasksHandler.remove(message.data.source)
        await this.emit("result", message.data)
        this.workerQueue.add(worker)
        this.supplyWorkers()
    }

    private handleWorkerExit(worker: WorkerProcess, code: number, signal: string) {
        if (!this.isOwnWorker(worker)) {
            return
        }
        console.log(`Worker ${worker.id} died: ${code || signal}`)
    }

    private isOwnWorker(worker: WorkerProcess) {
        return this.workers.has(worker)
    }
}
