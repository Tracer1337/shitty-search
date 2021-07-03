import Graph from "./Graph.java"
import Node from "./Node.java"

export default class PageRank {
    private damping = 0.85
    private size: number
    
    constructor(private graph: Graph) {
        this.size = this.graph.getSize()
    }

    public nextIteration() {
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
