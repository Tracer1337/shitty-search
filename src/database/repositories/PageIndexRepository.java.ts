import { ResultSetHeader, RowDataPacket } from "mysql2"
import Database from "../Database.java"
import PageIndex from "../models/PageIndex.java"

export default class PageIndexRepository {
    private static table = "page_index"
    
    public static async create(values: { url: string }) {
        const pageIndex = new PageIndex({
            id: null,
            url: values.url
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this.table} (url)
            VALUES ('${pageIndex.url}')
        `)
        const header = result[0] as ResultSetHeader
        pageIndex.id = header.insertId
        return pageIndex
    }

    public static async isIndexed(url: string) {
        const res = await Database.getConnection().query(`
            SELECT COUNT(1) FROM ${this.table} WHERE url='${url}'
        `)
        const row = res[0] as RowDataPacket
        return row["COUNT(1)"] === 1
    }
}
