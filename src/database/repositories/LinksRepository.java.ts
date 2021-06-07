import Database from "../Database.java"
import Link from "../models/Link.java"

export default class LinksRepository {
    private static table = "links"

    public static async create(values: {
        from_page_index_id: number,
        to_url: string
    }) {
        const link = new Link({
            id: null,
            from_page_index_id: values.from_page_index_id,
            to_url: values.to_url
        })
        await Database.getConnection().query(`
            INSERT INTO ${this.table} (from_page_index_id, to_url)
            VALUES ('${link.from_page_index_id}', '${link.to_url}')
        `)
    }
}
