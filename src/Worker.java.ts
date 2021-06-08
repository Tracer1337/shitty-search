import Crawler from "./Crawler.java"
import IPCMessage from "./structures/IPCMessage.java"

export default class Worker {
    constructor() {
        process.on("message", this.handleMasterMessage.bind(this))
    }

    private handleMasterMessage(rawMessage: IPCMessage) {
        if (rawMessage.command === "master.task") {
            const message = new IPCMessage<"master.task">(rawMessage)
            this.handleTask(message.data)
        }
    }

    private async handleTask(url: string) {
        const crawler = new Crawler(url)
        const result = await crawler.crawl()
        const message = new IPCMessage({
            command: "worker.result",
            data: { source: url, result }
        })
        process.send(message)
    }
}
