import Database from "shared/dist/database/Database.java"
import Graph from "./Graph.java"
import Node from "./Node.java"

export default class PageRank {
    private static readonly ITERATIONS = 1000

    public static async main(args: String[]) {
        const graph = await Graph.fromDatabase()
        const pagerank = new PageRank(graph)
        for (let i = 0; i < PageRank.ITERATIONS; i++) {
            pagerank.nextIteration()
        }
        graph.print()
        await Graph.toDatabase(graph)
        await Database.getConnection().end()
    }

    private graph: Graph
    private iteration = 0
    private damping = 0.85
    private size: number
    
    constructor(graph: Graph) {
        this.graph = graph
        this.iteration = 0
        this.damping = 0.85
        this.size = this.graph.getSize()
    }

    public nextIteration() {
        this.iteration++
        this.graph.getNodes().forEach((node) => {
            node.score = this.calcScore(node)
        })
    }

    private calcScore(node: Node) {
        let sum = 0
        node.inbound.forEach((node) => {
            sum += node.score / node.edges.length
        })
        return (1 - this.damping) / this.size + this.damping * sum
    }  
}
