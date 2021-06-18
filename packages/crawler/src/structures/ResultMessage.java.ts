import WorkerResult from "./WorkerResult.java"

export default class ResultMessage {
    public command: "worker.result"
    public data: {
        source: string,
        result: WorkerResult
    }

    constructor(values: {
        command: ResultMessage["command"],
        data: ResultMessage["data"]
    }) {
        this.command = values.command
        this.data = values.data

        if (this.command !== "worker.result") {
            throw new Error(`Expected "worker.result" but received "${this.command}"`)
        }

        if (this.data.result !== null) {
            this.data.result = new WorkerResult(this.data.result)
        }
    }
}
