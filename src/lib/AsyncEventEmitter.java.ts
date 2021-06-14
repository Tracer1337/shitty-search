export default class AsyncEventEmitter {
    private listeners: Record<string, Function[]> = {}

    public async emit(event: string, data: any) {
        const listeners = this.listeners[event]

        if (!listeners || listeners.length === 0) {
            return
        }
        
        await Promise.all(listeners.map(
            (listener) => listener(data)
        ))
    }

    public on(event: string, listener: Function) {
        if (!(event in this.listeners)) {
            this.listeners[event] = []
        }
        this.listeners[event].push(listener)
    }

    public off(event: string, listener: Function) {
        const listeners = this.listeners[event]
        if (!listeners || listeners.length === 0) {
            return
        }
        const index = listeners.indexOf(listener)
        listeners.splice(index, 1)
    }
}
