import { ResultSetHeader, RowDataPacket } from "mysql2"
import Database from "../Database.java"
import IndexQueueItem from "../models/IndexQueueItem.java"

export default class IndexQueueRepository {
    public static readonly TABLE = "index_queue"

    public static async add(values: { url: string }) {
        const indexQueueItem = new IndexQueueItem({
            id: null,
            url: values.url
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (url) VALUES ('${indexQueueItem.url}')
        `)
        const row = result[0] as ResultSetHeader
        indexQueueItem.id = row.insertId
        return indexQueueItem
    }

    public static async poll(amount = 1) {
        const result = await Database.getConnection().query(`
            SELECT * FROM ${this.TABLE} ORDER BY id ASC LIMIT ${amount}
        `)
        const rows = result[0] as RowDataPacket[]
        if (rows.length === 0) {
            return []
        }
        const indexQueueItems = rows.map((row) =>
            new IndexQueueItem({
                id: row.id,
                url: row.url
            })
        )
        await Promise.all(indexQueueItems.map((indexQueueItem) =>
            this.remove(indexQueueItem)
        ))
        return indexQueueItems
    }

    public static async has(url: string) {
        const result = await Database.getConnection().query(`
            SELECT COUNT(1) FROM ${this.TABLE} WHERE url='${url}'
        `)
        const [row] = result[0] as RowDataPacket[]
        return row["COUNT(1)"] >= 1
    }

    public static async remove(indexQueueItem: IndexQueueItem) {
        await Database.getConnection().query(`
            DELETE FROM ${this.TABLE} WHERE id='${indexQueueItem.id}'
        `)
    }
}
