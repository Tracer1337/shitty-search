import State from "./State.java"

export default class RootState extends State {
    public iteration = 0
    public amountDone = 0
    public amountTotal = 0

    constructor(values: {
        iteration?: number,
        amountDone?: number,
        amountTotal?: number
    }) {
        super()
        this.iteration = values.iteration
        this.amountDone = values.amountDone
        this.amountTotal = values.amountTotal
    }

    public clone() {
        return new RootState({
            iteration: this.iteration,
            amountDone: this.amountDone,
            amountTotal: this.amountTotal
        })
    }
}
