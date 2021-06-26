export default class IndexedWord {
    public id: number
    public page_index_id: number
    public word_id: number
    public position: number
    
    constructor(values: {
        id: number,
        page_index_id: number,
        word_id: number,
        position: number
    }) {
        this.id = values.id
        this.page_index_id = values.page_index_id
        this.word_id = values.word_id
        this.position = values.position
    }
}
