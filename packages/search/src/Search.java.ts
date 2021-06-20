import * as math from "mathjs"
import Database from "database"
import PageIndexRepository from "database/dist/repositories/PageIndexRepository.java"
import PageIndex from "database/dist/models/PageIndex.java"
import NullTransformer from "./NullTransformer.java"
import Normalizer from "./Normalizer.java"
import WordFrequencyScore from "./scores/WordFrequencyScore.java"
import WordLocationScore from "./scores/WordLocationScore.java"

export default class Search {
    private static readonly MAX_KEYWORDS = 100
    private static readonly scores = [
        WordFrequencyScore,
        WordLocationScore
    ]

    private keywords: string[]

    public static async main(args: string[]) {
        const search = new Search(args)
        const result = await search.getSearchResults()
        console.log(result)
        await Database.getConnection().end()
    }

    constructor(keywords: string[]) {
        if (keywords.length === 0) {
            throw new Error("No keywords given")
        }
        if (keywords.length > Search.MAX_KEYWORDS) {
            throw new Error("Too many keywords")
        }
        this.keywords = keywords
    }

    public async getSearchResults() {
        const pages = await PageIndexRepository.queryByKeywords(this.keywords)
        const scores = await this.getPageScores(pages)
        this.sortPagesByScores(pages, scores)
        return pages
    }

    private async getPageScores(pages: PageIndex[]) {
        const scores = await this.getScoresMatrix(pages)
        const weights = this.collectWeights()
        return math.multiply(scores, weights) as any as number[]
    }

    private async getScoresMatrix(pages: PageIndex[]) {
        const scores: number[][] = []

        await Promise.all(Search.scores.map(async (Score, i) => {
            const row: number[] = []

            await Promise.all(pages.map(async (page, j) => {
                const score = new Score(page, this.keywords)
                row[j] = await score.getScore()
            }))

            const nullTransformer = new NullTransformer(Score.higherIsBetter)
            nullTransformer.fit(row)
            const withoutNull = nullTransformer.transform(row)

            const normalizer = new Normalizer(Score.higherIsBetter ? [0, 1] : [1, 0])
            normalizer.fit(withoutNull)
            const normalized = normalizer.transform(withoutNull)

            scores[i] = normalized
        }))

        return math.transpose(scores)
    }

    private collectWeights() {
        return Search.scores.map((Score) => Score.weight)
    }

    private sortPagesByScores(pages: PageIndex[], scores: number[]) {
        const scoresMap: Record<string, number> = {}
        pages.forEach((page, i) => scoresMap[page.id] = scores[i])
        pages.sort((a, b) => scoresMap[b.id] - scoresMap[a.id])
    }
}
