export default class PerformanceResponse<T> {
    private duration: number
    private size: number
    private data: T
    
    constructor(values: {
        duration: number,
        size: number,
        data: T
    }) {
        this.duration = values.duration
        this.size = values.size
        this.data = values.data
    }

    toJSON() {
        return {
            meta: {
                duration: this.duration,
                size: this.size
            },
            data: this.data
        }
    }
}
