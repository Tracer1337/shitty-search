import WordsRepository from "database/dist/repositories/WordsRepository.java"
import Score from "./Score.java"

export default class WordFrequencyScore extends Score {
    public static weight = 1

    public async getScore() {
        const words = await WordsRepository.findWordsOfPage(
            this.pageIndex,
            this.keywords
        )
        return words.length
    }
}
