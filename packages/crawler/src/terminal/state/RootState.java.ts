import State from "./State.java"
import WorkerState from "./WorkerState.java"

export default class RootState extends State {
    public workers: WorkerState[]
    public indexSize = 0
    public storageQueueSize = 0

    constructor(values: {
        workers: WorkerState[],
        indexSize?: number,
        storageQueueSize?: number
    }) {
        super()
        this.workers = values.workers
        this.indexSize = values.indexSize || this.indexSize
        this.storageQueueSize = values.storageQueueSize || this.storageQueueSize
    }

    public clone() {
        return new RootState({
            workers: this.workers.map((state) => state.clone()),
            indexSize: this.indexSize,
            storageQueueSize: this.storageQueueSize
        })
    }
}
