import { ResultSetHeader, RowDataPacket } from "mysql2"
import Database from "../Database.java"
import Utils from "../../Utils.java"
import PageIndex from "../models/PageIndex.java"
import WordsRepository from "./WordsRepository.java"
import IndexedWordsRepository from "./IndexedWordsRepository.java"
import Word from "../models/Word.java"

export default class PageIndexRepository {
    public static readonly TABLE = "page_index"

    public static toString() {
        return this.TABLE
    }
    
    public static async create(values: { url: string }) {
        const pageIndex = new PageIndex({
            id: null,
            url: values.url
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this} (url) VALUES ('${pageIndex.url}')
        `)
        const header = result[0] as ResultSetHeader
        pageIndex.id = header.insertId
        return pageIndex
    }

    public static async isIndexed(url: string) {
        const res = await Database.getConnection().query(`
            SELECT COUNT(1) FROM ${this} WHERE url='${url}'
        `)
        const [row] = res[0] as RowDataPacket[]
        return row["COUNT(1)"] >= 1
    }

    public static async getIndexSize() {
        const res = await Database.getConnection().query(`
            SELECT COUNT(*) FROM ${this}
        `)
        const [row] = res[0] as RowDataPacket[]
        return row["COUNT(*)"]
    }

    public static async queryByWords(words: Word[]) {
        const wordIds = Utils.pickFromArrayAsString(words, "id")
        const result = await Database.getConnection().query(`
            SELECT DISTINCT ${this}.id, ${this}.url
            FROM ${IndexedWordsRepository}
            INNER JOIN ${WordsRepository}
            ON ${IndexedWordsRepository}.word_id = ${WordsRepository}.id
            INNER JOIN ${this}
            ON ${IndexedWordsRepository}.page_index_id = ${this}.id
            WHERE ${WordsRepository}.id
            IN (${Utils.stringifyList(wordIds)})
        `)
        const rows = result[0] as RowDataPacket[]
        return rows.map((row) =>
            new PageIndex({
                id: row.id,
                url: row.url
            })
        )
    }
}
