export default class PageIndex {
    public id: number
    public url: string
    public page_rank: number
    public title: string

    constructor(values: {
        id: number,
        url: string,
        page_rank: number,
        title: string
    }) {
        this.id = values.id
        this.url = values.url
        this.page_rank = values.page_rank
        this.title = values.title
    }

    toJSON() {
        return {
            url: this.url,
            title: this.title
        }
    }
}
