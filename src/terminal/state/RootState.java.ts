import State from "./State.java"
import WorkerState from "./WorkerState.java"

export default class RootState extends State {
    public workers: WorkerState[]
    public indexSize = 0

    constructor(values: {
        workers: WorkerState[],
        indexSize?: number
    }) {
        super()
        this.workers = values.workers
        this.indexSize = values.indexSize || this.indexSize
    }

    public clone() {
        return new RootState({
            workers: this.workers.map((state) => state.clone()),
            indexSize: this.indexSize
        })
    }
}
