import PageIndexRepository from "database/dist/repositories/PageIndexRepository.java"

export default class Search {
    public static async main(args: string[]) {
        const search = new Search(args)
        const result = await search.getSearchResults()
        console.log(result)
    }

    constructor(private keywords: string[]) {}

    public async getSearchResults() {
        return await PageIndexRepository.queryByKeywords(this.keywords)
    }
}
