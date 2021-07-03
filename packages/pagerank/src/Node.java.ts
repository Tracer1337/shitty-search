export default class Node {
    public score = 1
    public inbound: Node[] = []

    constructor(
        public key: number,
        public edges: Node[]
    ) {}

    public addEdge(node: Node) {
        this.edges.push(node)
        node.inbound.push(this)
    }

    public connectsToNode(node: Node) {
        return this.edges.includes(node)
    }
}
