export default class Link {
    public id: number
    public from_page_index_id: number
    public to_url: string

    constructor(values: {
        id: number,
        from_page_index_id: number,
        to_url: string
    }) {
        this.id = values.id
        this.from_page_index_id = values.from_page_index_id
        this.to_url = values.to_url
    }
}
