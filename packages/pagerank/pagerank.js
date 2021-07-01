class Node {
    score = 1

    constructor(key, edges) {
        this.key = key
        this.edges = edges
    }

    connectsToNode(node) {
        return this.edges.includes(node)
    }
}

class Graph {
    constructor(nodes) {
        this.nodes = nodes
    }

    print() {
        for (let node of this.nodes) {
            console.log(`${node.key}: ${node.score}`)
        }
    }
}

class PageRank {
    constructor(graph) {
        this.graph = graph
        this.iteration = 0
        this.d = 0.85
        this.n = this.graph.nodes.length
    }

    nextIteration() {
        this.iteration++
        for (let node of this.graph.nodes) {
            node.score = this.calcScore(node)
        }
    }

    calcScore(node) {
        const inboundNodes = this.getInboundNodes(node)
        let sum = 0
        for (let node of inboundNodes) {
            sum += node.score / node.edges.length
        }
        return (1 - this.d) / this.n + this.d * sum
    }

    getInboundNodes(node) {
        return this.graph.nodes.filter(
            (_node) => _node.connectsToNode(node)
        )
    }
}

const A = new Node('A', [])
const B = new Node('B', [])
const C = new Node('C', [B])
B.edges = [C]
const D = new Node('D', [A, B])
const E = new Node('E', [])
const F = new Node('F', [B, E])
E.edges = [B, F]
const G = new Node('G', [B, E])
const H = new Node('H', [B, E])
const I = new Node('I', [B, E])
const J = new Node('J', [E])
const K = new Node('K', [E])

const iterations = 1000

function run(d) {
    const graph = new Graph([A, B, C, D, E, F, G, H, I, J, K])
    
    const pageRank = new PageRank(graph)
    pageRank.d = d

    for (let i = 0; i < iterations; i++) {
        pageRank.nextIteration()
    }

    console.log(`Result after ${pageRank.iteration} iterations with d = ${pageRank.d}:`)
    graph.print()
}

const ds = [0.85]
ds.forEach(run)


