import Database from "../Database.java"
import PageIndex from "../models/PageIndex.java"
import Word from "../models/Word.java"

export default class WordsRepository {
    private static readonly TABLE = "words"

    public static async createMany(items: {
        pageIndex: PageIndex,
        word: string,
        position: number
    }[]) {
        const words = items.map((values) =>
            new Word({
                id: null,
                page_index_id: values.pageIndex.id,
                word: values.word,
                position: values.position
            })
        )
        const tuples = words.map((word) =>
            `('${word.page_index_id}', '${word.word}', '${word.position}')`
        )
        await Database.getConnection().query(`
            INSERT INTO ${this.TABLE} (page_index_id, word, position)
            VALUES ${tuples.join(", ")}
        `)
    }
}
