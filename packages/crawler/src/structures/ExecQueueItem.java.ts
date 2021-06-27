export default class ExecQueueItem {
    public key: string
    public fn: Function

    constructor(values: {
        key: string,
        fn: Function
    }) {
        this.key = values.key
        this.fn = values.fn
    }
}
