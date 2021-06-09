export default class Throttle {
    private iterations: number
    private timeout: number
    private onRelease: () => void
    private currentTick = 0
    public isThrottled = false

    constructor(values: {
        iterations: number,
        timeout: number,
        onRelease: () => void
    }) {
        this.iterations = values.iterations
        this.timeout = values.timeout
        this.onRelease = values.onRelease
    }

    public tick() {
        this.currentTick++
        if (this.currentTick === this.iterations && !this.isThrottled) {
            this.throttle()
        }
    }

    private throttle() {
        this.isThrottled = true
        setTimeout(() => {
            this.isThrottled = false
            this.currentTick = 0
            this.onRelease()
        }, this.timeout)
    }
}
