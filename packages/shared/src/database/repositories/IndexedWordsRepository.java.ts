import { RowDataPacket } from "mysql2"
import Database from "../Database.java"
import PageIndex from "../models/PageIndex.java"
import IndexedWord from "../models/IndexedWord.java"
import Utils from "../../Utils.java"
import WordsRepository from "./WordsRepository.java"

export default class IndexedWordsRepository {
    public static readonly TABLE = "indexed_words"

    public static toString() {
        return this.TABLE
    }

    public static async createMany(items: {
        pageIndex: PageIndex,
        word_id: number,
        position: number
    }[]) {
        if (items.length === 0) {
            return
        }
        const words = items.map((values) =>
            new IndexedWord({
                id: null,
                page_index_id: values.pageIndex.id,
                word_id: values.word_id,
                position: values.position
            })
        )
        const tuples = words.map((word) =>
            `('${word.page_index_id}', '${word.word_id}', '${word.position}')`
        )
        await Database.getConnection().query(`
            INSERT INTO ${this} (page_index_id, word_id, position)
            VALUES ${tuples.join(", ")}
        `)
    }

    public static async matchIndexedWordsInPage(
        pageIndexes: PageIndex[],
        words: string[]
    ) {
        const pageIds = pageIndexes.map((page) => page.id.toString())
        const result = await Database.getConnection().query(`
            SELECT * FROM ${WordsRepository}
            WHERE page_index_id IN (${Utils.stringifyList(pageIds)})
            AND LOWER(word) IN (${Utils.lowerStringifyList(words)})
            ORDER BY position ASC
        `)
        const rows = result[0] as RowDataPacket[]
        return rows.map((row) =>
            new IndexedWord({
                id: row.id,
                page_index_id: row.page_index_id,
                word_id: row.word_id,
                position: row.position
            })
        )
    }
}
