export default class Queue<T> extends Array<T> {
    public add(item: T) {
        return this.push(item)
    }

    public poll() {
        return this.shift()
    }

    public size() {
        return this.length
    }
}
