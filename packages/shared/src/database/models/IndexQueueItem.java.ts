export default class IndexQueueItem {
    public id: number
    public url: string

    constructor(values: {
        id: number,
        url: string
    }) {
        this.id = values.id
        this.url = values.url
    }
}
