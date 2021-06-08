import type WorkerResult from "./structures/WorkerResult.java"

export type IPCMessage = {
    command: "worker.result",
    data: {
        source: string,
        result: WorkerResult
    }
} | {
    command: "master.task",
    data: string
}
