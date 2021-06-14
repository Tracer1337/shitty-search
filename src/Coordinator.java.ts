import cluster from "cluster"
import Worker from "./Worker.java"
import WorkerPool from "./WorkerPool.java"
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

    private workerPool = new WorkerPool({
        throttle: {
            iterations: Config.ITERATIONS,
            timeout: Config.TIMEOUT
        }
    })
    private logStorage = new Storage("logs.txt")

    constructor() {
        this.workerPool.on("result", this.handleResult.bind(this))
    }

    public async run() {
        await Database.migrate()

        const entrypointIsKnown = await this.isKnownUrl(Config.ENTRYPOINT)
        if (!entrypointIsKnown) {
            await IndexQueueRepository.add({ url: Config.ENTRYPOINT })
        }

        this.workerPool.createWorkers(Config.THREADS)
    }

    private async handleResult({ source, result }: {
        source: string,
        result: WorkerResult | null
    }) {
        try {
            const pageIndex = await PageIndexRepository.create({ url: source })
            if (result !== null) {
                await this.storeResult(pageIndex, result)
            }
        } catch (error) {
            await this.logStorage.store(`${error.stack}\n\n`)
        }
    }
    
    private async storeResult(pageIndex: PageIndex, result: WorkerResult) {
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
