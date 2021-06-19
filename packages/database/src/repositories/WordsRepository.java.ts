import { RowDataPacket } from "mysql2"
import Database from "../Database.java"
import PageIndex from "../models/PageIndex.java"
import Word from "../models/Word.java"
import Utils from "../lib/Utils.java"

export default class WordsRepository {
    public static readonly TABLE = "words"

    public static async createMany(items: {
        pageIndex: PageIndex,
        word: string,
        position: number
    }[]) {
        if (items.length === 0) {
            return
        }
        const words = items.map((values) =>
            new Word({
                id: null,
                page_index_id: values.pageIndex.id,
                word: values.word,
                position: values.position
            })
        )
        const tuples = words.map((word) =>
            `('${word.page_index_id}', '${word.word}', '${word.position}')`
        )
        await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (page_index_id, word, position)
            VALUES ${tuples.join(", ")}
        `)
    }

    public static async findWordsOfPage(pageIndex: PageIndex, words: string[]) {
        const result = await Database.getConnection().query(`
            SELECT * FROM words
            WHERE page_index_id='${pageIndex.id}'
            AND LOWER(word) IN (${Utils.lowerStringifyList(words)})
        `)
        const rows = result[0] as RowDataPacket[]
        return rows.map((row) =>
            new Word({
                id: row.id,
                page_index_id: row.page_index_id,
                word: row.word,
                position: row.position
            })
        )
    }

    public static async getHighestPosition(pageIndex: PageIndex, words: string[]) {
        const result = await Database.getConnection().query(`
            SELECT MIN(position) FROM ${this.TABLE}
            WHERE page_index_id='${pageIndex.id}'
            AND LOWER(word) IN (${Utils.lowerStringifyList(words)})
        `)
        const [row] = result[0] as RowDataPacket[]
        return row["MIN(position)"] as number
    }
}
