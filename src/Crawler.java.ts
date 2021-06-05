import fetch, { Response } from "node-fetch"
import config from "../config.json"
import Parser from "./Parser.java"

export default class Crawler {
    public static async main(args: string[]) {
        const crawler = new Crawler(config.entrypoint)
        const links = await crawler.crawl()
        console.log(links)
    }

    constructor(private url: string) {}

    private shouldCrawl(response: Response) {
        if (response.status !== 200) {
            return false
        }

        const contentType = response.headers.get("Content-Type")
        if (!contentType || !this.matchContentType(contentType)) {
            return false
        }

        return true
    }

    private matchContentType(contentType: string) {
        return config.allowedContentTypes.some(
            (mime) => contentType.startsWith(mime)
        )
    }

    private filterLinks(links: Set<string>) {
        links.forEach((link) => {
            if (config.ignoreUrls.includes(link)) {
                links.delete(link)
            }
        })
    }

    public async crawl() {
        console.log("Crawling", this.url)

        const result = await fetch(this.url)

        if (!this.shouldCrawl(result)) {
            return null
        }

        const html = await result.text()
        const parser = new Parser(html)
        const links = parser.getLinks()
        this.filterLinks(links)

        return links
    }
}
