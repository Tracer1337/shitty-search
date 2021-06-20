import Word from "database/dist/models/Word.java"

export default class PageData {
    public words: Word[]
    
    constructor(values: { words: Word[] }) {
        this.words = values.words
    }
}
