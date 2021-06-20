import Score from "./Score.java"

export default class WordLocationScore extends Score {
    public static higherIsBetter = false

    public async getScore() {
        const positions = this.pageData.words.map((word) => word.position)
        return Math.min(...positions)
    }
}
