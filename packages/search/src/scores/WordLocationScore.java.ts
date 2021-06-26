import Utils from "../../../shared/dist/Utils.java"
import Score from "./Score.java"

export default class WordLocationScore extends Score {
    public static higherIsBetter = false

    public async getScore() {
        const positions = Utils.pickFromArray(this.pageData.words, "position")
        return Math.min(...positions)
    }
}
