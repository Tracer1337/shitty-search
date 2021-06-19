import { ResultSetHeader, RowDataPacket } from "mysql2"
import Database from "../Database.java"
import PageIndex from "../models/PageIndex.java"

export default class PageIndexRepository {
    private static readonly TABLE = "page_index"
    
    public static async create(values: { url: string }) {
        const pageIndex = new PageIndex({
            id: null,
            url: values.url
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (url) VALUES ('${pageIndex.url}')
        `)
        const header = result[0] as ResultSetHeader
        pageIndex.id = header.insertId
        return pageIndex
    }

    public static async isIndexed(url: string) {
        const res = await Database.getConnection().query(`
            SELECT COUNT(1) FROM ${this.TABLE} WHERE url='${url}'
        `)
        const [row] = res[0] as RowDataPacket[]
        return row["COUNT(1)"] >= 1
    }

    public static async getIndexSize() {
        const res = await Database.getConnection().query(`
            SELECT COUNT(*) FROM ${this.TABLE}
        `)
        const [row] = res[0] as RowDataPacket[]
        return row["COUNT(*)"]
    }

    public static async queryByKeywords(keywords: string[]) {
        const wordList = keywords
            .map((word) => word.toLowerCase())
            .map((word) => `'${word}'`)
            .join(",")
        const result = await Database.getConnection().query(`
            SELECT DISTINCT page_index.id, page_index.url
            FROM words
            INNER JOIN page_index ON words.page_index_id = page_index.id
            WHERE LOWER(words.word) IN (${wordList})
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
