import PageIndex from "shared/dist/database/models/PageIndex.java"
import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import LinksRepository from "shared/dist/database/repositories/LinksRepository.java"

export default class PageRank {
    private static readonly NODE_GENERATOR_STEPS = 1000

    public static async main(args: String[]) {
        const pageRank = await PageRank.createInstance()
        const iterations = 1000
        for (let i = 0; i < iterations; i++) {
            await pageRank.nextIteration()
        }
    }

    public static async createInstance() {
        const pageRank = new PageRank()
        const n = await PageIndexRepository.getIndexSize()
        pageRank.setN(n)
        return pageRank
    }

    private constructor() {}

    private iterations = 0
    private d = 0.85
    private n = 0

    public async nextIteration() {
        for await (let node of this.nodeGenerator()) {
            const score = await this.calcScore(node)
            await this.setScore(node, score)
        }
        this.iterations++
    }

    private async calcScore(node: PageIndex) {
        const inboundNodes = await this.getInboundNodes(node)
        const edgesMap = await this.getEdgesMap(inboundNodes)
        let sum = 0
        for (let inNode of inboundNodes) {
            const score = this.getScore(inNode)
            const edges = edgesMap[inNode.id]
            sum += score / edges
        }
        return (1 - this.d) / this.n + this.d * sum
    }

    private getScore(node: PageIndex) {
        return node.page_rank
    }

    private async getInboundNodes(node: PageIndex) {
        return await PageIndexRepository.getInboundPages(node)
    }

    private async getEdgesMap(nodes: PageIndex[]) {
        return await LinksRepository.getAmountOfLinks(nodes)
    }

    private async setScore(node: PageIndex, score: number) {
        node.page_rank = score
        await PageIndexRepository.update(node)
    }

    private async * nodeGenerator() {
        let nodes: PageIndex[] = []
        let from = 0
        let to = PageRank.NODE_GENERATOR_STEPS
        do {
            if (nodes.length === 0) {
                nodes = await PageIndexRepository.getAll({ from, to })
                from = to
                to = from + PageRank.NODE_GENERATOR_STEPS
            }
            yield nodes.shift()
        } while (nodes.length > 0)
    }

    public getIterations() {
        return this.iterations
    }

    public setN(n: number) {
        this.n = n
    }
}
