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
            CREATE TABLE IF NOT EXISTS page_index (
                id int PRIMARY KEY AUTO_INCREMENT,
                url varchar(255) NOT NULL UNIQUE,
                page_rank int DEFAULT 1
            );
        `,
        "links": `
            CREATE TABLE IF NOT EXISTS links (
                id int PRIMARY KEY AUTO_INCREMENT,
                from_page_index_id int NOT NULL REFERENCES page_index(id),
                to_page_index_id int NOT NULL REFERENCES page_index(id)
            );
        `,
        "words": `
            CREATE TABLE IF NOT EXISTS words (
                id int PRIMARY KEY AUTO_INCREMENT,
                word varchar(255) NOT NULL UNIQUE
            );
        `,
        "indexed_words": `
            CREATE TABLE IF NOT EXISTS indexed_words (
                id int PRIMARY KEY AUTO_INCREMENT,
                page_index_id int NOT NULL REFERENCES page_index(id),
                word_id int NOT NULL REFERENCES words(id),
                position int NOT NULL,
                INDEX (page_index_id, word_id, position)
            );
        `,
        "index_queue": `
            CREATE TABLE IF NOT EXISTS index_queue (
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
        const connection = this.getConnection()
        for (let table in this.TABLES) {
            await connection.query(this.TABLES[table])
        }
    }
}
