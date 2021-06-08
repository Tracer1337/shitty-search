import mysql, { RowDataPacket } from "mysql2/promise"

export default class Database {
    private static host = "localhost"
    private static user = "root"
    private static password = "root"
    private static database = "search-engine"

    private static tables: Record<string, string> = {
        "page_index": `
            CREATE TABLE page_index (
                id int PRIMARY KEY AUTO_INCREMENT,
                url varchar(255) NOT NULL UNIQUE
            );
        `,
        "links": `
            CREATE TABLE links (
                id int PRIMARY KEY AUTO_INCREMENT,
                from_page_index_id int NOT NULL REFERENCES page_index(id),
                to_url varchar(255) NOT NULL
            );
        `,
        "words": `
            CREATE TABLE words (
                id int PRIMARY KEY AUTO_INCREMENT,
                page_index_id int NOT NULL REFERENCES page_index(id),
                word varchar(255) NOT NULL,
                position int NOT NULL
            );
        `,
        "index_queue": `
            CREATE TABLE index_queue (
                id int PRIMARY KEY AUTO_INCREMENT,
                url varchar(255) NOT NULL UNIQUE
            );
        `,
    }

    private static connection: mysql.Pool

    public static getConnection() {
        if (this.connection) {
            return this.connection
        }
        this.connection = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        })
        return this.connection
    }

    public static async migrate() {
        const existingTables = await this.getTables()
        const connection = this.getConnection()
        for (let table in this.tables) {
            if (existingTables.includes(table)) {
                continue
            }
            await connection.query(this.tables[table])
        }
    }

    private static async getTables() {
        const connection = this.getConnection()
        const result = await connection.query("SHOW TABLES")
        const rows = result[0] as RowDataPacket[]
        return rows.map((row) => row["Tables_in_" + this.database])
    }
}
