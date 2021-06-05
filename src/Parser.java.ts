export default class Parser {
    private static linkRegex = /https?:\/\/[0-9A-z.-]+(\/[0-9A-z./-]*)?/g

    constructor(private html: string) {}

    public getLinks() {
        const matches = this.html.match(Parser.linkRegex)
        return new Set(matches)
    }
}
