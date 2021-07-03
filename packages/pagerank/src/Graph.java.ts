import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import LinksRepository from "shared/dist/database/repositories/LinksRepository.java"
import Node from "./Node.java"

export default class Graph {
    public static async fromDatabase() {
        const pageIndexes = await PageIndexRepository.getAll()
        const links = await LinksRepository.getAll()
        
        const nodes = pageIndexes.map((pageIndex) => {
            const node = new Node(pageIndex.id, [])
            node.score = pageIndex.page_rank
            return node
        })
        const graph = new Graph(nodes)
        
        links.forEach((link) => {
            const fromNode = graph.getNodeByKey(link.from_page_index_id)
            const toNode = graph.getNodeByKey(link.to_page_index_id)
            fromNode.addEdge(toNode)
        })

        return graph
    }

    public static async toDatabase(graph: Graph) {
        const pageIndexes = await PageIndexRepository.getAll()
        pageIndexes.forEach((pageIndex) => {
            const node = graph.getNodeByKey(pageIndex.id)
            pageIndex.page_rank = node.score
        })
        await PageIndexRepository.updateAll(pageIndexes)
    }

    private nodesMap: Record<number, Node> = {}
    private nodesList: Node[] = []

    constructor(nodes: Node[]) {
        nodes.forEach((node) => this.addNode(node))
    }

    public getNodes() {
        return this.nodesList
    }

    public addNode(node: Node) {
        this.nodesList.push(node)
        this.nodesMap[node.key] = node
    }
    
    public getSize() {
        return this.nodesList.length
    }

    public getNodeByKey(key: number) {
        return this.nodesMap[key]
    }

    public print() {
        for (let node of this.nodesList.slice(0, 10)) {
            console.log(`${node.key}: ${node.score}`)
        }
        console.log(`... ${this.getSize() - 10} more`)
    }
}
