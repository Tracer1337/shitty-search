import PageIndex from "shared/dist/database/models/PageIndex.java"
import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import LinksRepository from "shared/dist/database/repositories/LinksRepository.java"
import TerminalUI from "./terminal/TerminalUI.java"

export default class PageRank {
    private static readonly NODE_GENERATOR_STEPS = 1000

    public static async main(args: String[]) {
        const ui = new TerminalUI()
        const pageRank = await PageRank.createInstance(ui)
        const iterations = 1000
        for (let i = 0; i < iterations; i++) {
            await pageRank.nextIteration()
        }
    }

    public static async createInstance(ui: TerminalUI) {
        const pageRank = new PageRank(ui)
        const size = await PageIndexRepository.getIndexSize()
        pageRank.setSize(size)
        return pageRank
    }

    private constructor(private ui: TerminalUI) {}

    private iterations = 0
    private damping = 0.85
    private size = 0

    public async nextIteration() {
        this.resetUI()
        let i = 0
        for await (let node of this.nodeGenerator()) {
            const score = await this.calcScore(node)
            await this.setScore(node, score)
            this.ui.setAmountDoneState(i++)
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
        return (1 - this.damping) / this.size + this.damping * sum
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

    private resetUI() {
        this.ui.setIterationState(this.iterations)
        this.ui.setAmountDoneState(0)
        this.ui.setAmountTotalState(this.size)
    }

    public getIterations() {
        return this.iterations
    }

    public setSize(size: number) {
        this.size = size
    }
}
