import Score from "./Score.java"

export default class ContainsKeywordsScore extends Score {
    public static higherIsBetter = true

    public async getScore() {
        const words = this.createLowercaseSet(
            this.pageData.words.map((word) => word.word)
        )
        return words.size
    }

    private createLowercaseSet(strings: string[]) {
        return new Set(strings.map((string) => string.toLowerCase()))
    }
}
