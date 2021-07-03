import State from "./State.java"

export default class RootState extends State {
    public iteration = 0
    public targetIterations = 0
    public status: "Idle" | "Fetching" | "Ranking" | "Storing" = "Idle"

    constructor(values: {
        iteration?: number,
        targetIterations?: number,
        status?: RootState["status"]
    }) {
        super()
        this.iteration = values.iteration
        this.targetIterations = values.targetIterations
        this.status = values.status
    }

    public clone() {
        return new RootState({
            iteration: this.iteration,
            targetIterations: this.targetIterations,
            status: this.status
        })
    }
}
