import Word from "shared/src/database/models/Word.java"

export default class PageData {
    public words: Word[]
    
    constructor(values: { words: Word[] }) {
        this.words = values.words
    }
}
