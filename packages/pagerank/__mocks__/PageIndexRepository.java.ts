import PageIndex from "./PageIndex.java"

export default class PageIndexRepository {
    private static rows = [
        new PageIndex({ id: 0, url: "A", page_rank: 1 }),
        new PageIndex({ id: 1, url: "B", page_rank: 1 }),
        new PageIndex({ id: 2, url: "C", page_rank: 1 }),
        new PageIndex({ id: 3, url: "D", page_rank: 1 }),
        new PageIndex({ id: 4, url: "E", page_rank: 1 }),
        new PageIndex({ id: 5, url: "F", page_rank: 1 }),
        new PageIndex({ id: 6, url: "G", page_rank: 1 }),
        new PageIndex({ id: 7, url: "H", page_rank: 1 }),
        new PageIndex({ id: 8, url: "I", page_rank: 1 }),
        new PageIndex({ id: 9, url: "J", page_rank: 1 }),
        new PageIndex({ id: 10, url: "K", page_rank: 1 }),
    ]

    private static edges = {
        "A": [],
        "B": ["C"],
        "C": ["B"],
        "D": ["A", "B"],
        "E": ["B", "F"],
        "F": ["B", "E"],
        "G": ["B", "E"],
        "H": ["B", "E"],
        "I": ["B", "E"],
        "J": ["E"],
        "K": ["E"],
    }

    private static findRowByUrl(url: string) {
        return this.rows.find((row) => row.url === url)
    }

    public static async getSize() {
        return this.rows.length
    }

    public static async getInboundPages(pageIndex: PageIndex) {
        const entries = Object.entries(this.edges)
        return entries
            .filter(([fromUrl, toUrls]) => toUrls.includes(pageIndex.url))
            .map(([fromUrl]) => this.findRowByUrl(fromUrl))
    }
    
    public static async getOutboundPages(pageIndex: PageIndex) {
        return this.edges[pageIndex.url].map(this.findRowByUrl.bind(this))
    }

    public static async update(pageIndex: PageIndex) {
        const index = this.rows.findIndex((row) => row.id === pageIndex.id)
        this.rows[index] = pageIndex
    }

    public static async getAll(options?: {
        from?: number,
        to?: number
    }) {
        return this.rows.slice(options.from, options.to)
    }

    public static print() {
        this.rows.forEach((row) => console.log(`${row.url}: ${row.page_rank}`))
    }
}
