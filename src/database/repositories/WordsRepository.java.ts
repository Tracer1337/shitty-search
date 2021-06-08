import { ResultSetHeader } from "mysql2";
import Database from "../Database.java";
import PageIndex from "../models/PageIndex.java";
import Word from "../models/Word.java";

export default class WordsRepository {
    private static readonly TABLE = "words"

    public static async create(values: {
        pageIndex: PageIndex,
        word: string,
        position: number
    }) {
        const word = new Word({
            id: null,
            page_index_id: values.pageIndex.id,
            word: values.word,
            position: values.position
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (page_index_id, word, position)
            VALUES ('${word.page_index_id}', '${word.word}', '${word.position}')
        `)
        const headers = result[0] as ResultSetHeader
        word.id = headers.insertId
        return word
    }
}
