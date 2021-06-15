import { EventEmitter } from "events"

export default class Utils {
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
