import IndexedWord from "shared/dist/database/models/IndexedWord.java"
import Link from "../../../shared/dist/database/models/Link.java"

export default class PageData {
    public words: IndexedWord[]
    public links: Link[]
    
    constructor(values: {
        words: IndexedWord[],
        links: Link[]
    }) {
        this.words = values.words
        this.links = values.links
    }
}
