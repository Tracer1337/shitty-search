import IndexedWord from "shared/dist/database/models/IndexedWord.java"

export default class PageData {
    public words: IndexedWord[]
    
    constructor(values: { words: IndexedWord[] }) {
        this.words = values.words
    }
}
