import Queue from "./Queue.java"
import config from "../config.json"
import Crawler from "./Crawler.java"
import Storage from "./Storage.java"

export default class Coordinator {    
    public static main(args: string[]) {
        const coordinator = new Coordinator()
        coordinator.run()
    }

    private urls = new Queue<string>()
    private knownUrls: string[] = []
    private urlsStorage = new Storage("queue.txt")
    private knownUrlsStorage = new Storage("known.txt")

    constructor() {
        this.urls.add(config.entrypoint)
    }

    public async run() {
        while(this.urls.size() > 0) {
            this.urlsStorage.clear()
            this.urlsStorage.store(this.urls.join("\n"))

            this.knownUrlsStorage.clear()
            this.knownUrlsStorage.store(this.knownUrls.join("\n"))

            const crawler = new Crawler(this.urls.poll())
            const newUrls = await crawler.crawl()

            if (newUrls === null) {
                continue
            }

            const filtered = this.filterUrls(Array.from(newUrls))

            filtered.forEach((url) => this.knownUrls.push(url))
            filtered.forEach((url) => this.urls.add(url))
        }
    }

    private filterUrls(urls: string[]) {
        return urls.filter((url) => !this.knownUrls.includes(url))
    }
}
