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

    public static findByWordContent = Utils.memoizedAsync(async (word: string) => {
        const result = await Database.getConnection().query(`
            SELECT * FROM ${this} WHERE word='${word}'
        `)
        const [row] = result[0] as RowDataPacket[]
        
        return !row ? null : new Word({
            id: row.id,
            word: row.word
        })
    })

    public static async getWordIdsMap(words: string[]) {
        const idsMap: Record<string, number> = {}
        const uniqueWords = Utils.unique(words)
        await Promise.all(uniqueWords.map(async (word) => {
            let model = await this.findByWordContent(word)
            if (!model) {
                model = await this.create({ word })
            }
            idsMap[word] = model.id
        }))
        return idsMap
    }
}
