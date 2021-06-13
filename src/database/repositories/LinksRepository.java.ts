import Database from "../Database.java"
import Link from "../models/Link.java"

export default class LinksRepository {
    private static readonly TABLE = "links"

    public static async createMany(items: {
        from_page_index_id: number,
        to_url: string
    }[]) {
        const links = items.map((values) =>
            new Link({
                id: null,
                from_page_index_id: values.from_page_index_id,
                to_url: values.to_url
            })
        )
        const tuples = links.map((link) =>
            `('${link.from_page_index_id}', '${link.to_url}')`
        )
        await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (from_page_index_id, to_url)
            VALUES ${tuples.join(", ")}
        `)
    }
}
