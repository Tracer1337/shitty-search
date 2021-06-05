import cluster, { Worker as WorkerProcess } from "cluster"
import os from "os"
import Queue from "./Queue.java"
import Storage from "./Storage.java"
import Worker from "./Worker.java"
import Database from "./database/Database.java"
import { IPCMessage } from "./types"
import config from "../config.json"

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
    private indexQueue = new Queue<string>()
    private knownUrls: string[] = []

    private indexQueueStorage = new Storage("queue.txt")
    private knownUrlsStorage = new Storage("known.txt")
    private indexedUrlsStorage = new Storage("indexed.txt")

    constructor() {
        this.indexQueue.add(config.entrypoint)
        cluster.on("exit", this.handleWorkerExit.bind(this))
        cluster.on("message", this.handleWorkerMessage.bind(this))
        cluster.on("online", this.supplyWorkers.bind(this))
    }

    public async run() {
        await Database.migrate()
        this.createWorkers()
    }

    private createWorkers() {
        for (let i = 0; i < Coordinator.nThreads; i++) {
            const worker = cluster.fork()
            this.workerQueue.add(worker)
        }
    }

    private supplyWorkers() {
        for (let worker of this.workerQueue) {
            if (!worker.isConnected()) {
                continue
            }

            if (this.indexQueue.size() <= 0) {
                break
            }

            const message: IPCMessage = {
                command: "master.task",
                data: this.indexQueue.poll()
            }
            worker.send(message)

            this.workerQueue.remove(worker)
        }

        this.storeState()
    }

    private async handleWorkerMessage(worker: WorkerProcess, message: IPCMessage) {
        if (message.command === "worker.result") {
            if (message.data.result !== null) {
                const newUrls = this.filterUrls(message.data.result)
                newUrls.forEach((url) => this.knownUrls.push(url))
                newUrls.forEach((url) => this.indexQueue.add(url))
            }
            this.workerQueue.add(worker)
            this.supplyWorkers()
            await this.indexedUrlsStorage.store(message.data.source)
        }
    }

    private handleWorkerExit(worker: WorkerProcess, code: number, signal: string) {
        console.log(`Worker ${worker.process.pid} died: ${code || signal}`)
    }

    private async storeState() {
        await Promise.all([
            this.indexQueueStorage.clear(),
            this.knownUrlsStorage.clear()
        ])
        await Promise.all([
            this.indexQueueStorage.store(this.indexQueue.join("\n")),
            this.knownUrlsStorage.store(this.knownUrls.join("\n"))
        ])
    }

    private filterUrls(urls: string[]) {
        return urls.filter((url) => !this.knownUrls.includes(url))
    }
}
