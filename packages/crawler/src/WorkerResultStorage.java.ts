import PageIndex from "shared/dist/database/models/PageIndex.java"
import LinksRepository from "shared/dist/database/repositories/LinksRepository.java"
import WordsRepository from "shared/dist/database/repositories/WordsRepository.java"
import IndexQueueRepository from "shared/dist/database/repositories/IndexQueueRepository.java"
import WorkerResult from "./structures/WorkerResult.java"
import Utils from "shared/dist/Utils.java"

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
