import { ResultSetHeader, RowDataPacket } from "mysql2"
import Database from "../Database.java"
import IndexQueueItem from "../models/IndexQueueItem.java"

export default class IndexQueueRepository {
    private static table = "index_queue"

    public static async add(values: { url: string }) {
        const indexQueueItem = new IndexQueueItem({
            id: null,
            url: values.url
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this.table} (url) VALUES ('${indexQueueItem.url}')
        `)
        const row = result[0] as ResultSetHeader
        indexQueueItem.id = row.insertId
        return indexQueueItem
    }

    public static async poll() {
        const result = await Database.getConnection().query(`
            SELECT * FROM ${this.table} ORDER BY id ASC LIMIT 1
        `)
        const [row] = result[0] as RowDataPacket[]
        if (!row) {
            return null
        }
        const indexQueueItem = new IndexQueueItem({
            id: row.id,
            url: row.url
        })
        await this.remove(indexQueueItem)
        return indexQueueItem
    }

    public static async has(url: string) {
        const result = await Database.getConnection().query(`
            SELECT COUNT(1) FROM ${this.table} WHERE url='${url}'
        `)
        const [row] = result[0] as RowDataPacket[]
        return row["COUNT(1)"] >= 1
    }

    public static async remove(indexQueueItem: IndexQueueItem) {
        await Database.getConnection().query(`
            DELETE FROM ${this.table} WHERE id='${indexQueueItem.id}'
        `)
    }
}
