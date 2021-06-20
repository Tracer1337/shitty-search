import Score from "./Score.java"

export default class WordFrequencyScore extends Score {
    public static higherIsBetter = true

    public async getScore() {
        return this.pageData.words.length
    }
}
