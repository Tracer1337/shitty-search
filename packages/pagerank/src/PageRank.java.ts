import PageIndex from "../__mocks__/PageIndex.java"
import PageIndexRepository from "../__mocks__/PageIndexRepository.java"

export default class PageRank {
    private static readonly NODE_GENERATOR_STEPS = 1000

    public static async main(args: String[]) {
        const pageRank = await PageRank.createInstance()
        const iterations = 1000
        for (let i = 0; i < iterations; i++) {
            await pageRank.nextIteration()
        }
        console.log(`Result after ${iterations} iterations:`)
        PageIndexRepository.print()
    }

    public static async createInstance() {
        const pageRank = new PageRank()
        const n = await PageIndexRepository.getSize()
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
        let sum = 0
        for (let inNode of inboundNodes) {
            const score = this.getScore(inNode)
            const edges = await this.getEdges(inNode)
            sum += score / edges.length
        }
        return (1 - this.d) / this.n + this.d * sum
    }

    private getScore(node: PageIndex) {
        return node.page_rank
    }

    private async getInboundNodes(node: PageIndex) {
        return await PageIndexRepository.getInboundPages(node)
    }

    private async getEdges(node: PageIndex) {
        return await PageIndexRepository.getOutboundPages(node)
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
