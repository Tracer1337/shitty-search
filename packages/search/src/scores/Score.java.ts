import PageIndex from "database/dist/models/PageIndex.java"

export default abstract class Score {
    protected abstract weight: number

    constructor(
        private pageIndex: PageIndex,
        private keywords: string[]
    ) {}

    public getWeight() {
        return this.weight
    }

    public abstract getScore(): Promise<number>
}
