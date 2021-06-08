import cheerio, { CheerioAPI } from "cheerio"

export default class Parser {
    private static urlMaxLength = 255
    private static wordMinLength = 2
    private static wordMaxLength = 255
    private static maxWords = 1e4
    private static ignoreTags = [
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
        this.$("*").each((_i, node) => {
            const handle = this.$(node)

            if (handle.children().length > 0) {
                return
            }

            const tagName = (handle.prop("tagName") as string)?.toLowerCase()
            if (Parser.ignoreTags.includes(tagName)) {
                return
            }

            const text = handle.text()
            const nodeWords = text
                .split(/[^\d\w-]/)
                .filter((word) => (
                    word.length >= Parser.wordMinLength &&
                    word.length <= Parser.wordMaxLength
                ))

            let i = 0
            while (words.length <= Parser.maxWords && nodeWords[i]) {
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
        if (urlString.length > Parser.urlMaxLength) {
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
