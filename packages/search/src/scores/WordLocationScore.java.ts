import WordsRepository from "database/dist/repositories/WordsRepository.java"
import Score from "./Score.java"

export default class WordLocationScore extends Score {
    public static higherIsBetter = false

    public async getScore() {
        const position = await WordsRepository.getHighestPosition(
            this.pageIndex,
            this.keywords
        )
        return position
    }
}
