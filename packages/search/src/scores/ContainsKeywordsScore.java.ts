import Utils from "shared/dist/Utils.java"
import Score from "./Score.java"

export default class ContainsKeywordsScore extends Score {
    public static higherIsBetter = true

    public async getScore() {
        const words = Utils.unique(Utils.pickFromArray(
            this.pageData.words,
            "word_id"
        ))
        return words.length
    }
}
