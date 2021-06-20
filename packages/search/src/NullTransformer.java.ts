export default class NullTransformer {
    private min: number
    private max: number

    constructor(private transformLow = true) {}

    public fit(dataset: number[]) {
        if (this.transformLow) {
            this.min = Math.min(...dataset)
        } else {
            this.max = Math.max(...dataset)
        }
    }

    public transform(input: number[]) {
        const replacement = this.transformLow ? this.min - 1 : this.max + 1
        return input.map((value) => value === null ? replacement : value)
    }
}
