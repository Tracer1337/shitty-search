import * as math from "mathjs"
import Database from "shared/dist/database/Database.java"
import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import IndexedWordsRepository from "shared/dist/database/repositories/IndexedWordsRepository.java"
import WordsRepository from "shared/dist/database/repositories/WordsRepository.java"
import LinksRepository from "shared/dist/database/repositories/LinksRepository.java"
import PageIndex from "shared/dist/database/models/PageIndex.java"
import Word from "shared/dist/database/models/Word.java"
import PageData from "./structures/PageData.java"
import NullTransformer from "./NullTransformer.java"
import Normalizer from "./Normalizer.java"
import WordFrequencyScore from "./scores/WordFrequencyScore.java"
import WordLocationScore from "./scores/WordLocationScore.java"
import WordDistanceScore from "./scores/WordDistanceScore.java"
import ContainsKeywordsScore from "./scores/ContainsKeywordsScore.java"
import InboundLinksScore from "./scores/InboundLinksScore.java"
import PageRankScore from "./scores/PagerankScore.java"

export default class Search {
    private static readonly MAX_KEYWORDS = 100
    // TODO: Use correct typing here (should be [number, typeof Score])
    private static readonly scores: [number, typeof WordFrequencyScore][] = [
        [1, WordFrequencyScore],
        [1, WordLocationScore],
        [1, WordDistanceScore],
        [1, ContainsKeywordsScore],
        [1, InboundLinksScore],
        [1, PageRankScore]
    ]

    private keywords: Word[]

    public static async main(args: string[]) {
        const search = await Search.createInstance(args)
        const result = await search.getSearchResults()
        console.log(result)
        await Database.getConnection().end()
    }

    public static async createInstance(keywords: string[]) {
        if (keywords.length === 0) {
            throw new Error("No keywords given")
        }
        if (keywords.length > Search.MAX_KEYWORDS) {
            throw new Error("Too many keywords")
        }
        const instance = new Search()
        const lowerKeywords = keywords.map((keyword) => keyword.toLowerCase())
        instance.keywords = await WordsRepository.getManyByWordContent(lowerKeywords, true)
        return instance
    }

    private constructor() {}

    public async getSearchResults() {
        const pages = await PageIndexRepository.queryByWords(this.keywords)
        if (pages.length === 0) {
            return []
        }
        const pageData = await this.getPageData(pages)
        const scores = await this.getPageScores(pages, pageData)
        this.sortPagesByScores(pages, scores)
        return pages
    }

    private async getPageData(pages: PageIndex[]) {
        const data: Record<string, PageData> = {}

        const getPageData = (pageIndexId: number) => {
            data[pageIndexId] ??= new PageData({
                words: [],
                links: []
            })
            return data[pageIndexId]
        }

        const words = await IndexedWordsRepository.matchIndexedWordsInPages(pages, this.keywords)
        const links = await LinksRepository.getLinksToPages(pages)

        words.forEach((word) => {
            getPageData(word.page_index_id).words.push(word)
        })

        links.forEach((link) => {
            getPageData(link.to_page_index_id).links.push(link)
        })
        
        return data
    }

    private async getPageScores(pages: PageIndex[], pageData: Record<string, PageData>) {
        const scores = await this.getScoresMatrix(pages, pageData)
        const weights = this.collectWeights()
        return math.multiply(scores, weights) as any as number[]
    }

    private async getScoresMatrix(pages: PageIndex[], pageData: Record<string, PageData>) {
        const scores: number[][] = []

        await Promise.all(Search.scores.map(async ([_weight, Score], i) => {
            const row: number[] = []

            await Promise.all(pages.map(async (page, j) => {
                const score = new Score(page, pageData[page.id], this.keywords)
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
        return Search.scores.map(([weight]) => weight)
    }

    private sortPagesByScores(pages: PageIndex[], scores: number[]) {
        const scoresMap: Record<string, number> = {}
        pages.forEach((page, i) => scoresMap[page.id] = scores[i])
        pages.sort((a, b) => scoresMap[b.id] - scoresMap[a.id])
    }
}
