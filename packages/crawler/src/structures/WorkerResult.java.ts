export default class WorkerResult {
    public links: string[]
    public words: string[]

    constructor(values: {
        links: string[],
        words: string[]
    }) {
        this.links = values.links
        this.words = values.words
    }
}
