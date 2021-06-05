import Crawler from "./Crawler.java"
import { IPCMessage } from "./types"

export default class Worker {
    constructor() {
        process.on("message", this.handleMasterMessage.bind(this))
    }

    private handleMasterMessage(message: IPCMessage) {
        if (message.command === "master.task") {
            this.handleTask(message.data)
        }
    }

    private async handleTask(url: string) {
        const crawler = new Crawler(url)
        const links = await crawler.crawl()
        const message: IPCMessage = {
            command: "worker.result",
            data: {
                source: url,
                result: links !== null ? Array.from(links) : null
            }
        }
        process.send(message)
    }
}
