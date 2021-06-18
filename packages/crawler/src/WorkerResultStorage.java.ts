import WorkerResult from "./structures/WorkerResult.java"
import PageIndex from "./database/models/PageIndex.java"
import LinksRepository from "./database/repositories/LinksRepository.java"
import WordsRepository from "./database/repositories/WordsRepository.java"
import IndexQueueRepository from "./database/repositories/IndexQueueRepository.java"
import Utils from "./Utils.java"

export default class WorkerResultStorage {
    constructor(
        private pageIndex: PageIndex,
        private result: WorkerResult
    ) {}

    public async storeResult() {
        await Promise.all([
            this.storeLinks(),
            this.storeWords()
        ])
    }

    private async storeLinks() {
        await LinksRepository.createMany(
            this.result.links.map((url) => ({
                from_page_index_id: this.pageIndex.id,
                to_url: url
            }))
        )
        for (let url of this.result.links) {
            const isKnownUrl = await Utils.isKnownUrl(url)
            if (!isKnownUrl) {
                await IndexQueueRepository.add({ url })
            }
        }
    }

    private async storeWords() {
        await WordsRepository.createMany(
            this.result.words.map((word, i) => ({
                pageIndex: this.pageIndex,
                word,
                position: i
            }))
        )
    }
}
