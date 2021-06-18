import cheerio, { CheerioAPI } from "cheerio"
import ErrorHandler from "./ErrorHandler.java"

export default class Parser {
    private static readonly URL_MAX_LENGTH = 255
    private static readonly WORD_MIN_LENGTH = 2
    private static readonly WORD_MAX_LENGTH = 255
    private static readonly MAX_WORDS = 1e4
    private static readonly IGNORE_TAGS = [
        "style",
        "script",
        "noscript",
        "iframe"
    ]

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

    public getWords() {
        const words: string[] = []
        const nodes = ErrorHandler.withErrorHandler(() => this.$("*"))
        if (!nodes) {
            return []
        }
        nodes.each((_i, node) => {
            const handle = this.$(node)

            if (handle.children().length > 0) {
                return
            }

            const tagName = (handle.prop("tagName") as string)?.toLowerCase()
            if (Parser.IGNORE_TAGS.includes(tagName)) {
                return
            }

            const text = handle.text()
            const nodeWords = text
                .split(/[^\d\w-]/)
                .filter((word) => (
                    word.length >= Parser.WORD_MIN_LENGTH &&
                    word.length <= Parser.WORD_MAX_LENGTH
                ))

            let i = 0
            while (words.length <= Parser.MAX_WORDS && nodeWords[i]) {
                words.push(nodeWords[i++])
            }
        })
        return words
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
        if (urlString.length > Parser.URL_MAX_LENGTH) {
            return false
        }
        try {
            const url = new URL(urlString)
            return url.protocol === "http:" || url.protocol === "https:"
        } catch {
            return false
        }
    }
}
