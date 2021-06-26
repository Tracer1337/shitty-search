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

    public static memoizedAsync<TArgs extends Array<any>, TReturn>(
        fn: (...args: TArgs) => Promise<TReturn>,
        getKey: (...args: TArgs) => string
    ) {
        const cache: Record<string | number, TReturn> = {}
        return async (...args: TArgs): Promise<TReturn> => {
            const key = getKey(...args)
            if (!(key in cache)) {
                cache[key] = await fn(...args)
            }
            return cache[key]
        }
    }

    public static unique<T>(array: T[]) {
        return Array.from(new Set(array))
    }

    public static pickFromArray<T extends Record<any, any>, K extends keyof T>(
        array: T[],
        key: K
    ) {
        return array.map((object) => object[key] as T[K])
    }

    public static pickFromArrayAsString<T extends Record<any, any>, K extends keyof T>(
        array: T[],
        key: K
    ) {
        return array.map((object) => object[key].toString() as string)
    }
}
