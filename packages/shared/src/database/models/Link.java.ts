export default class Link {
    public id: number
    public from_page_index_id: number
    public to_page_index_id: number

    constructor(values: {
        id: number,
        from_page_index_id: number,
        to_page_index_id: number
    }) {
        this.id = values.id
        this.from_page_index_id = values.from_page_index_id
        this.to_page_index_id = values.to_page_index_id
    }
}
