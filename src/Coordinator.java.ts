import cluster, { Worker as WorkerProcess } from "cluster"
import os from "os"
import Queue from "./Queue.java"
import Worker from "./Worker.java"
import Database from "./database/Database.java"
import PageIndexRepository from "./database/repositories/PageIndexRepository.java"
import IPCMessage from "./structures/IPCMessage.java"
import config from "../config.json"
import LinksRepository from "./database/repositories/LinksRepository.java"
import PageIndex from "./database/models/PageIndex.java"
import IndexQueueRepository from "./database/repositories/IndexQueueRepository.java"
import Storage from "./Storage.java"
import WorkerResult from "./structures/WorkerResult.java"
import WordsRepository from "./database/repositories/WordsRepository.java"

export default class Coordinator {
    private static nThreads = os.cpus().length

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
    private logStorage = new Storage("logs.txt")

    constructor() {
        cluster.on("exit", this.handleWorkerExit.bind(this))
        cluster.on("message", this.handleWorkerMessage.bind(this))
        cluster.on("online", this.supplyWorkers.bind(this))
    }

    public async run() {
        await Database.migrate()

        const entrypointIsKnown = await this.isKnownUrl(config.entrypoint)
        if (!entrypointIsKnown) {
            await IndexQueueRepository.add({ url: config.entrypoint })
        }

        this.createWorkers()
    }

    private createWorkers() {
        for (let i = 0; i < Coordinator.nThreads; i++) {
            const worker = cluster.fork()
            this.workerQueue.add(worker)
        }
    }

    private async supplyWorkers() {
        for (let worker of this.workerQueue) {
            if (!worker.isConnected()) {
                continue
            }

            const indexQueueItem = await IndexQueueRepository.poll()

            if (!indexQueueItem) {
                return
            }

            const message = new IPCMessage({
                command: "master.task",
                data: indexQueueItem.url
            })
            worker.send(message)

            this.workerQueue.remove(worker)
        }
    }

    private async handleWorkerMessage(worker: WorkerProcess, rawMessage: IPCMessage) {
        if (rawMessage.command === "worker.result") {
            const message = new IPCMessage<"worker.result">(rawMessage)
            try {
                const pageIndex = await PageIndexRepository.create({ url: message.data.source })
                if (message.data.result !== null) {
                    const result = new WorkerResult(message.data.result)
                    await this.storeWorkerResult(pageIndex, result)
                }
            } catch (error) {
                await this.logStorage.store(`${error.stack}\n\n`)
            }
            this.workerQueue.add(worker)
            this.supplyWorkers()
        }
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
        for (let url of urls) {
            await LinksRepository.create({
                from_page_index_id: pageIndex.id,
                to_url: url
            })
            const isKnownUrl = await this.isKnownUrl(url)
            if (!isKnownUrl) {
                await IndexQueueRepository.add({ url })
            }
        }
    }

    private async storeWords(pageIndex: PageIndex, words: string[]) {
        await Promise.all(words.map(async (word, i) => {
            await WordsRepository.create({
                pageIndex,
                word,
                position: i
            })
        }))
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
        return false
    }
}
