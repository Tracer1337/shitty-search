export default class PageIndex {
    id: number
    url: string    

    constructor(values: {
        id: number,
        url: string
    }) {
        this.id = values.id
        this.url = values.url
    }
}
