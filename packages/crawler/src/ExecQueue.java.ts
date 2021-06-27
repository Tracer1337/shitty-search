import ExecQueueItem from "./structures/ExecQueueItem.java"

export default class ExecQueue extends Array<ExecQueueItem> {
    private isExecuting = false
    
    public add(item: ExecQueueItem) {
        if (this.hasItemKey(item.key)) {
            return
        }
        this.push(item)
        this.execute()
    }

    private poll() {
        return this.shift()
    }

    private hasItemKey(key: string) {
        return this.some((item) => key === item.key)
    }

    private async execute() {
        if (this.isExecuting) {
            return
        }
        this.isExecuting = true
        
        while (this.length > 0) {
            await this.poll().fn()
        }

        this.isExecuting = false
    }
}
