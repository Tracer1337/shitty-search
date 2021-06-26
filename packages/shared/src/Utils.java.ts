import { EventEmitter } from "events"
import IndexQueueRepository from "./database/repositories/IndexQueueRepository.java"
import PageIndexRepository from "./database/repositories/PageIndexRepository.java"

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

    public static stringifyList(strings: string[]) {
        return strings
            .map((string) => `'${string}'`)
            .join(",")
    }

    public static lowerStringifyList(strings: string[]) {
        return Utils.stringifyList(
            strings.map((string) => string.toLowerCase())
        )
    }

    public static memoizedAsync<TArg extends string | number, TReturn>(
        fn: (arg: TArg) => Promise<TReturn>
    ) {
        const cache: Record<string | number, TReturn> = {}
        return async (arg: TArg): Promise<TReturn> => {
            if (!(arg in cache)) {
                cache[arg] = await fn(arg)
            }
            return cache[arg]
        }
    }

    public static unique<T>(array: T[]) {
        return Array.from(new Set(array))
    }
}
