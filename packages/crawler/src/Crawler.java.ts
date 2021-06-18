import fetch, { Response } from "node-fetch"
import Config from "./Config.java"
import ErrorHandler from "./ErrorHandler.java"
import Parser from "./Parser.java"
import WorkerResult from "./structures/WorkerResult.java"

export default class Crawler {
    private static readonly ALLOWED_CONTENT_TYPES = ["text/html"]

    public static async main(args: string[]) {
        const crawler = new Crawler(Config.ENTRYPOINT)
        const result = await crawler.crawl()
        console.log(result)
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
        return Crawler.ALLOWED_CONTENT_TYPES.some(
            (mime) => contentType.startsWith(mime)
        )
    }

    public async crawl() {
        let response: Response

        try {
            response = await fetch(this.url)
        } catch (error) {
            ErrorHandler.handleError(error)
            return null
        }

        if (!this.shouldCrawl(response)) {
            return null
        }

        const html = await response.text()
        const parser = new Parser(html)
        const result = new WorkerResult({
            links: Array.from(parser.getLinks()),
            words: parser.getWords()
        })

        return result
    }
}
