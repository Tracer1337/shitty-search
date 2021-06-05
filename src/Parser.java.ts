import cheerio, { CheerioAPI } from "cheerio"

export default class Parser {
    private $: CheerioAPI

    constructor(html: string) {
        this.$ = cheerio.load(html)
    }

    public getLinks() {
        const links = this.$("a").map((_i, element) => {
            const href = this.$(element).attr("href")
            return href ? this.trimUrl(href) : null
        })
        const filtered = Array.from(links)
            .filter((link) => link !== null)
            .filter((link) => this.isHttpUrl(link))
        return new Set(filtered)
    }

    private trimUrl(urlString: string) {
        try {
            const url = new URL(urlString)
            url.search = ""
            url.hash = ""
            return url.toString()
        } catch {
            return null
        }
    }

    private isHttpUrl(urlString: string) {
        try {
            const url = new URL(urlString)
            return url.protocol === "http:" || url.protocol === "https:"
        } catch {
            return false
        }
    }
}
