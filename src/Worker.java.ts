import Crawler from "./Crawler.java"
import ResultMessage from "./structures/ResultMessage.java"
import TaskMessage from "./structures/TaskMessage.java"

export default class Worker {
    constructor() {
        process.on("message", this.handleMasterMessage.bind(this))
    }

    private handleMasterMessage(rawMessage: TaskMessage) {
        if (rawMessage.command === "master.task") {
            const message = new TaskMessage(rawMessage)
            this.handleTask(message.data)
        }
    }

    private async handleTask(url: string) {
        const crawler = new Crawler(url)
        const result = await crawler.crawl()
        const message = new ResultMessage({
            command: "worker.result",
            data: { source: url, result }
        })
        process.send(message)
    }
}
