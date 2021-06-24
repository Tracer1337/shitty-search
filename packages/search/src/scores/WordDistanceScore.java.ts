import Word from "shared/src/database/models/Word.java"
import Score from "./Score.java"

export default class WordDistanceScore extends Score {
    public static higherIsBetter = false

    public async getScore() {
        if (this.keywords.length === 1) {
            return 1
        }
        return this.findClosestSequence(this.pageData.words)
    }

    private findClosestSequence(words: Word[]) {
        let currentKeywordIndex = 0
        const diffs: number[] = []

        for (let i = 0; i < words.length; i++) {
            if (words[i].word !== this.keywords[currentKeywordIndex]) {
                currentKeywordIndex = 0
                if (words[i].word !== this.keywords[currentKeywordIndex]) {
                    continue
                }
            }

            if (currentKeywordIndex === this.keywords.length - 1) {
                const diff = this.calcDiff(
                    words
                        .slice(i + 1 - this.keywords.length, i + 1)
                        .map((word) => word.position)
                )
                diffs.push(diff)
                currentKeywordIndex = 0
                continue
            }

            currentKeywordIndex++
        }

        return diffs.length === 0 ? null : Math.min(...diffs)
    }

    private calcDiff(numbers: number[]) {
        let diff = 0
        for (let i = 0; i < numbers.length - 1; i++) {
            diff += Math.abs(numbers[i + 1] - numbers[i])
        }
        return diff
    }
}
