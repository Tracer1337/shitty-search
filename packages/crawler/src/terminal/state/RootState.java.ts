import State from "./State.java"
import WorkerState from "./WorkerState.java"

export default class RootState extends State {
    public workers: WorkerState[]
    public indexedPages = 0
    public crawledPages = 0

    constructor(values: {
        workers: WorkerState[],
        indexedPages?: number,
        crawledPages?: number
    }) {
        super()
        this.workers = values.workers
        this.indexedPages = values.indexedPages || this.indexedPages
        this.crawledPages = values.crawledPages || this.crawledPages
    }

    public clone() {
        return new RootState({
            workers: this.workers.map((state) => state.clone()),
            indexedPages: this.indexedPages,
            crawledPages: this.crawledPages,
        })
    }
}
