import cluster, { Worker as WorkerProcess } from "cluster"
import IndexQueueRepository from "database/dist/repositories/IndexQueueRepository.java"
import AsyncEventEmitter from "./lib/AsyncEventEmitter.java"
import Queue from "./Queue.java"
import Throttle from "./Throttle.java"
import ResultMessage from "./structures/ResultMessage.java"
import TaskMessage from "./structures/TaskMessage.java"

export default class WorkerPool extends AsyncEventEmitter {
    private workers = new Set<WorkerProcess>()
    private workerQueue = new Queue<WorkerProcess>()
    private workerTasks = new Map<WorkerProcess, number>()
    private isSupplyingWorkers = false
    private throttle: Throttle
    private tasksPerWorker: number

    constructor(props: {
        tasksPerWorker: number,
        throttle: {
            iterations: number,
            timeout: number
        }
    }) {
        super()

        this.tasksPerWorker = props.tasksPerWorker
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
            this.workerTasks.set(worker, 0)
        }
    }

    public getWorkers() {
        return Array.from(this.workers)
    }

    public getWorkerTasks(worker: WorkerProcess) {
        return this.workerTasks.get(worker)
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

            const amountTasks = this.tasksPerWorker - this.workerTasks.get(worker)

            const indexQueueItems = await IndexQueueRepository.poll(amountTasks)
            if (indexQueueItems.length === 0) {
                this.workerQueue.putBack(worker)
                break
            }

            await Promise.all(indexQueueItems.map(
                (item) => this.sendTaskToWorker(worker, item.url)
            ))
        }

        this.isSupplyingWorkers = false
        
        this.emit("updateWorkers")
    }

    private async sendTaskToWorker(worker: WorkerProcess, task: string) {
        this.updateWorkerTasks(worker, 1)

        const message = new TaskMessage({
            command: "master.task",
            data: task
        })
        worker.send(message)

        this.throttle.tick()
    }

    private updateWorkerTasks(worker: WorkerProcess, delta: number) {
        this.workerTasks.set(worker, this.workerTasks.get(worker) + delta)
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

        await this.emit("result", message.data)
        
        this.updateWorkerTasks(worker, -1)
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
