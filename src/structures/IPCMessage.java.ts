import WorkerResult from "./WorkerResult.java"

export default class IPCMessage<T extends "master.task" | "worker.result" = never>{
    public command: T
    public data: T extends "master.task"
        ? string
        : T extends "worker.result"
        ? {
            source: string,
            result: WorkerResult
        }
        : never

    constructor(values: {
        command: T,
        data: IPCMessage<T>["data"]
    }) {
        this.command = values.command
        this.data = values.data
    }
}
