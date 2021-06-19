export default class Normalizer {
    private min = 0
    private max = 1

    constructor(private targetRange: [number, number] = [0, 1]) {}

    public fit(dataset: number[]) {
        this.min = Math.min(...dataset)
        this.max = Math.max(...dataset)
    }

    public transform(input: number) {
        const [toMin, toMax] = this.targetRange
        return (input - this.min) * (toMax - toMin) / (this.max - this.min) + toMin
    }
}
