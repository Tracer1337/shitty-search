import State from "./State.java"

export default class WorkerState extends State {
    public id: number
    public tasks: number
    
    constructor(values: {
        id: number,
        tasks: number
    }) {
        super()
        this.id = values.id
        this.tasks = values.tasks
    }

    public clone() {
        return new WorkerState({
            id: this.id,
            tasks: this.tasks
        })
    }
}
