import Database from "database"
import PageIndexRepository from "database/dist/repositories/PageIndexRepository.java"
import PageIndex from "database/dist/models/PageIndex.java"

export default class Search {
    private static readonly scores = []

    public static async main(args: string[]) {
        const search = new Search(args)
        const result = await search.getSearchResults()
        console.log(result)
        await Database.getConnection().end()
    }

    constructor(private keywords: string[]) {}

    public async getSearchResults() {
        const pages = await PageIndexRepository.queryByKeywords(this.keywords)
        const scores = await this.getScoresMap(pages)
        pages.sort((a, b) => scores[a.id] - scores[b.id])
        return pages
    }

    private async getScoresMap(pages: PageIndex[]) {
        const scores: Record<string, number> = {}
        await Promise.all(pages.map(async (page) => {
            scores[page.id] = await this.getPageScore(page)
        }))
        return scores
    }

    private async getPageScore(page: PageIndex) {
        let totalScore = 0
        await Promise.all(Search.scores.map(async (Score) => {
            const score = new Score(page, this.keywords)
            totalScore += await score.getScore() * score.getWeight()
        }))
        return totalScore / Search.scores.length
    }
}
