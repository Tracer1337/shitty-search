import { ResultSetHeader, RowDataPacket } from "mysql2"
import Utils from "../../Utils.java"
import Database from "../Database.java"
import Word from "../models/Word.java"

export default class WordsRepository {
    public static readonly TABLE = "words"

    public static toString() {
        return this.TABLE
    }

    public static async create(values: { word: string }) {
        const word = new Word({
            id: null,
            word: values.word
        })
        const result = await Database.getConnection().query(`
            INSERT INTO ${this} (word) VALUES ('${word.word}')
        `)
        const header = result[0] as ResultSetHeader
        word.id = header.insertId
        return word
    }

    public static getByWordContent = Utils.memoizedAsync(
        async (word: string, create: boolean = false) => {
            const result = await Database.getConnection().query(`
                SELECT * FROM ${this} WHERE word='${word}'
            `)
            const [row] = result[0] as RowDataPacket[]
            if (!row) {
                return !create ? null : await this.create({ word })
            }
            return new Word({
                id: row.id,
                word: row.word
            })
        },
        (word) => word
    )

    public static async getManyByWordContent(words: string[], create = false) {
        const result = await Database.getConnection().query(`
            SELECT * FROM ${this} WHERE word IN (${Utils.stringifyList(words)})
        `)
        const rows = result[0] as RowDataPacket[]
        if (!create) {
            return rows.map((row) => new Word({
                id: row.id,
                word: row.word
            }))
        }
        return await Promise.all(words.map((word) => {
            const row = rows.find((row) => row.word === word)
            if (!row) {
                return this.create({ word })
            }
            return new Word({
                id: row.id,
                word: row.word
            })
        }))
    }

    public static async getWordIdsMap(words: string[]) {
        const idsMap: Record<string, number> = {}
        const uniqueWords = Utils.unique(words)
        await Promise.all(uniqueWords.map(async (word) => {
            const model = await this.getByWordContent(word, true)
            idsMap[word] = model.id
        }))
        return idsMap
    }
}
