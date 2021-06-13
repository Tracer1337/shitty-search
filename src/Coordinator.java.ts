import cluster, { Worker as WorkerProcess } from "cluster"
import Queue from "./Queue.java"
import Throttle from "./Throttle.java"
import Worker from "./Worker.java"
import Config from "./Config.java"
import Storage from "./Storage.java"
import WorkerResult from "./structures/WorkerResult.java"
import Database from "./database/Database.java"
import PageIndex from "./database/models/PageIndex.java"
import PageIndexRepository from "./database/repositories/PageIndexRepository.java"
import LinksRepository from "./database/repositories/LinksRepository.java"
import WordsRepository from "./database/repositories/WordsRepository.java"
import IndexQueueRepository from "./database/repositories/IndexQueueRepository.java"
import BusyTasksHandler from "./redis/handlers/BusyTasksHandler.java"
import ResultMessage from "./structures/ResultMessage.java"
import TaskMessage from "./structures/TaskMessage.java"

export default class Coordinator {
    public static main(args: string[]) {
        if (cluster.isMaster) {
            const coordinator = new Coordinator()
            coordinator.run()
        }

        if (cluster.isWorker) {
            new Worker()
        }
    }

    private workerQueue = new Queue<WorkerProcess>()
    private isSupplyingWorkers = false
    private logStorage = new Storage("logs.txt")
    private throttle = new Throttle({
        iterations: Config.ITERATIONS,
        timeout: Config.TIMEOUT,
        onRelease: this.supplyWorkers.bind(this)
    })

    constructor() {
        cluster.on("exit", this.handleWorkerExit.bind(this))
        cluster.on("message", this.handleWorkerMessage.bind(this))
        cluster.on("online", this.supplyWorkers.bind(this))
    }

    public async run() {
        await Database.migrate()

        const entrypointIsKnown = await this.isKnownUrl(Config.ENTRYPOINT)
        if (!entrypointIsKnown) {
            await IndexQueueRepository.add({ url: Config.ENTRYPOINT })
        }

        this.createWorkers()
    }

    private createWorkers() {
        for (let i = 0; i < Config.THREADS; i++) {
            const worker = cluster.fork()
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

            this.workerQueue.remove(worker)
        }

        this.isSupplyingWorkers = false
    }

    private async handleWorkerMessage(worker: WorkerProcess, rawMessage: ResultMessage) {
        const message = new ResultMessage(rawMessage)

        try {
            const pageIndex = await PageIndexRepository.create({ url: message.data.source })
            if (message.data.result !== null) {
                await this.storeWorkerResult(pageIndex, message.data.result)
            }
        } catch (error) {
            await this.logStorage.store(`${error.stack}\n\n`)
        }
        
        await BusyTasksHandler.remove(message.data.source)
        this.workerQueue.add(worker)
        this.supplyWorkers()
    }

    private handleWorkerExit(worker: WorkerProcess, code: number, signal: string) {
        console.log(`Worker ${worker.process.pid} died: ${code || signal}`)
    }
    
    private async storeWorkerResult(pageIndex: PageIndex, result: WorkerResult) {
        await Promise.all([
            this.storeLinks(pageIndex, result.links),
            this.storeWords(pageIndex, result.words)
        ])
    }

    private async storeLinks(pageIndex: PageIndex, urls: string[]) {
        await LinksRepository.createMany(
            urls.map((url) => ({
                from_page_index_id: pageIndex.id,
                to_url: url
            }))
        )
        for (let url of urls) {
            const isKnownUrl = await this.isKnownUrl(url)
            if (!isKnownUrl) {
                await IndexQueueRepository.add({ url })
            }
        }
    }

    private async storeWords(pageIndex: PageIndex, words: string[]) {
        await WordsRepository.createMany(
            words.map((word, i) => ({
                pageIndex,
                word,
                position: i
            }))
        )
    }

    private async isKnownUrl(url: string) {
        const isQueued = await IndexQueueRepository.has(url)
        if (isQueued) {
            return true
        }

        const isIndexed = await PageIndexRepository.isIndexed(url)
        if (isIndexed) {
            return true
        }

        const isBusy = await BusyTasksHandler.isBusy(url)
        if (isBusy) {
            return true
        }

        return false
    }
}
