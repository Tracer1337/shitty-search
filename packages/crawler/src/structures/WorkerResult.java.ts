export default class WorkerResult {
    public links: string[]
    public words: string[]
    public title: string

    constructor(values: {
        links: string[],
        words: string[],
        title: string
    }) {
        this.links = values.links
        this.words = values.words
        this.title = values.title
    }
}
