import Score from "./Score.java"

export default class PageRankScore extends Score {
    public static higherIsBetter = true

    public async getScore() {
        return this.pageIndex.page_rank
    }
}
