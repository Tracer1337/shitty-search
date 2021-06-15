import State from "./State.java"
import WorkerState from "./WorkerState.java"

export default class RootState extends State {
    public workers: WorkerState[]

    constructor(values: {
        workers: WorkerState[]
    }) {
        super()
        this.workers = values.workers
    }

    public clone() {
        return new RootState({
            workers: this.workers.map((state) => state.clone())
        })
    }
}
