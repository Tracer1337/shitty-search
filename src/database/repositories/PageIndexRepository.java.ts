import Database from "../Database.java"
import PageIndex from "../models/PageIndex.java"

export default class PageIndexRepository {
    private static table = "page_index"
    
    public static async create(values: { url: string }) {
        const pageIndex = new PageIndex({
            id: null,
            url: values.url
        })
        await Database.getConnection().query(`
            INSERT INTO ${this.table} (url)
            VALUES ('${pageIndex.url}')
        `)
    }
}
