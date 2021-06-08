export default class Word {
    public id: number
    public page_index_id: number
    public word: string
    public position: number
    
    constructor(values: {
        id: number,
        page_index_id: number,
        word: string,
        position: number
    }) {
        this.id = values.id
        this.page_index_id = values.page_index_id
        this.word = values.word
        this.position = values.position
    }
}
