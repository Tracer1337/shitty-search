export type IPCMessage = {
    command: "worker.result",
    data: {
        source: string,
        result: string[]
    }
} | {
    command: "master.task",
    data: string
}
