export default class TaskMessage {
    public command: "master.task"
    public data: string

    constructor(values: {
        command: TaskMessage["command"],
        data: string
    }) {
        this.command = values.command
        this.data = values.data

        if (this.command !== "master.task") {
            throw new Error(`Expected "master.task" but received "${this.command}"`)
        }
    }
}
