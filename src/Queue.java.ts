export default class Queue<T> extends Array<T> {
    public add(item: T) {
        return this.push(item)
    }

    public poll() {
        return this.shift()
    }

    public remove(item: T) {
        const index = this.indexOf(item)
        if (index !== -1) {
            this.splice(index, 1)
        }
    }

    public size() {
        return this.length
    }
}
