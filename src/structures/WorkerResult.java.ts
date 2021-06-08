export default class WorkerResult {
    links: string[]
    words: string[]

    constructor(values: {
        links: string[],
        words: string[]
    }) {
        this.links = values.links
        this.words = values.words
    }
}
