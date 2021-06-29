import { RowDataPacket } from "mysql2"
import Utils from "../../Utils.java"
import Database from "../Database.java"
import Link from "../models/Link.java"
import PageIndex from "../models/PageIndex.java"

export default class LinksRepository {
    public static readonly TABLE = "links"

    public static toString() {
        return this.TABLE
    }

    public static async createMany(items: {
        from_page_index_id: number,
        to_page_index_id: number
    }[]) {
        if (items.length === 0) {
            return
        }
        const links = items.map((values) =>
            new Link({
                id: null,
                from_page_index_id: values.from_page_index_id,
                to_page_index_id: values.to_page_index_id
            })
        )
        const tuples = links.map((link) =>
            `('${link.from_page_index_id}', '${link.to_page_index_id}')`
        )
        await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (from_page_index_id, to_page_index_id)
            VALUES ${tuples.join(", ")}
        `)
    }

    public static async getLinksToPages(targets: PageIndex[]) {
        const ids = Utils.stringifyList(Utils.pickFromArrayAsString(targets, "id"))
        const result = await Database.getConnection().query(`
            SELECT ${this}.* FROM ${this} WHERE ${this}.to_page_index_id IN (${ids})
        `)
        const rows = result[0] as RowDataPacket[]
        return rows.map((row) =>
            new Link({
                id: row.id,
                from_page_index_id: row.from_page_index_id,
                to_page_index_id: row.to_page_index_id
            })
        )
    }
}
