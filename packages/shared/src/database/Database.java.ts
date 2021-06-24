import mysql, { RowDataPacket } from "mysql2/promise"
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") })

export default class Database {
    private static readonly HOST = process.env.DATABASE_HOST
    private static readonly PORT = parseInt(process.env.DATABASE_PORT)
    private static readonly USER = process.env.DATABASE_USER
    private static readonly PASSWORD = process.env.DATABASE_PASSWORD
    private static readonly DATABASE = process.env.DATABASE_NAME

    private static readonly TABLES: Record<string, string> = {
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
            host: this.HOST,
            port: this.PORT,
            user: this.USER,
            password: this.PASSWORD,
            database: this.DATABASE
        })
        return this.connection
    }

    public static async migrate() {
        const existingTables = await this.getTables()
        const connection = this.getConnection()
        for (let table in this.TABLES) {
            if (existingTables.includes(table)) {
                continue
            }
            await connection.query(this.TABLES[table])
        }
    }

    private static async getTables() {
        const connection = this.getConnection()
        const result = await connection.query("SHOW TABLES")
        const rows = result[0] as RowDataPacket[]
        return rows.map((row) => row["Tables_in_" + this.DATABASE])
    }
}
