import { EventEmitter } from "events"
import PageIndexRepository from "./database/repositories/PageIndexRepository.java"
import IndexQueueRepository from "./database/repositories/IndexQueueRepository.java"

export default class Utils {
    public static async isKnownUrl(url: string) {
        const isQueued = await IndexQueueRepository.has(url)
        if (isQueued) {
            return true
        }

        const isIndexed = await PageIndexRepository.isIndexed(url)
        if (isIndexed) {
            return true
        }

        return false
    }

    public static createListeners(
        target: EventEmitter,
        events: Array<[string, (...args: any[]) => void]>
    ) {
        events.forEach(([name, listener]) => {
            target.on(name, listener)
        })
    
        return () => events.forEach(([name, listener]) => {
            target.off(name, listener)
        })
    }
}
