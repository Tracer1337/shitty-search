export default class PageIndex {
    public id: number
    public url: string    

    constructor(values: {
        id: number,
        url: string
    }) {
        this.id = values.id
        this.url = values.url
    }

    toJSON() {
        return {
            url: this.url
        }
    }
}
