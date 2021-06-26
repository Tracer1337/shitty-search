export default class Word {
    public id: number
    public word: string
    
    constructor(values: {
        id: number,
        word: string,
    }) {
        this.id = values.id
        this.word = values.word
    }
}
