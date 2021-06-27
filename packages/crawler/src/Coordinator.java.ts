import cluster from "cluster"
import Database from "shared/dist/database/Database.java"
import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import IndexQueueRepository from "shared/dist/database/repositories/IndexQueueRepository.java"
import Worker from "./Worker.java"
import WorkerPool from "./WorkerPool.java"
import ExecQueue from "./ExecQueue.java"
import Config from "./Config.java"
import WorkerResult from "./structures/WorkerResult.java"
import TerminalUI from "./terminal/TerminalUI"
import WorkerState from "./terminal/state/WorkerState.java"
import ErrorHandler from "./ErrorHandler.java"
import WorkerResultStorage from "./WorkerResultStorage.java"
import Utils from "shared/dist/Utils.java"
import Arguments from "./Arguments.java"
import ExecQueueItem from "./structures/ExecQueueItem.java"

export default class Coordinator {
    public static async main(args: string[]) {
        Arguments.parseArguments(args)
        Config.init()

        if (cluster.isMaster) {
            await Database.migrate()
            const ui = new TerminalUI()
            const coordinator = new Coordinator(ui)
            coordinator.run()
        }

        if (cluster.isWorker) {
            new Worker()
        }
    }

    private workerPool = new WorkerPool({
        tasksPerWorker: Config.TASKS_PER_THREAD,
        throttle: {
            iterations: Config.ITERATIONS,
            timeout: Config.TIMEOUT
        }
    })
    private resultStorageQueue = new ExecQueue()

    constructor(private ui: TerminalUI) {
        this.workerPool.on("result", this.handleResult.bind(this))
        this.workerPool.on("updateWorkers", this.updateWorkersUI.bind(this))
    }

    public async run() {
        const entrypointIsKnown = await Utils.isKnownUrl(Config.ENTRYPOINT)
        if (!entrypointIsKnown) {
            await IndexQueueRepository.add({ url: Config.ENTRYPOINT })
        }

        this.workerPool.createWorkers(Config.THREADS)
        this.updateWorkersUI()
    }

    private handleResult({ source, result }: {
        source: string,
        result: WorkerResult | null
    }) {
        const queueItem = new ExecQueueItem({
            key: source,
            fn: () => ErrorHandler.withErrorHandlerAsync(async () => {
                const pageIndex = await PageIndexRepository.create({ url: source })
                if (result !== null) {
                    const resultStorage = new WorkerResultStorage(pageIndex, result)
                    await resultStorage.storeResult()
                }
            })
        })
        this.resultStorageQueue.add(queueItem)
        this.ui.setStorageQueueSize(this.resultStorageQueue.size())
    }

    private updateWorkersUI() {
        const workers = this.workerPool.getWorkers()
        const state = workers.map((worker) =>
            new WorkerState({
                id: worker.id,
                tasks: this.workerPool.getWorkerTasks(worker)
            })
        )
        this.ui.setWorkerState(state)
    }
}
