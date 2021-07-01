export default class PageIndex {
    public id: number
    public url: string
    public page_rank: number

    constructor(values: {
        id: number,
        url: string,
        page_rank: number
    }) {
        this.id = values.id
        this.url = values.url
        this.page_rank = values.page_rank
    }

    toJSON() {
        return {
            url: this.url
        }
    }
}
