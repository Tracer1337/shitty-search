import PageIndex from "database/dist/models/PageIndex.java"

export default abstract class Score {
    public static weight = 1

    constructor(
        protected pageIndex: PageIndex,
        protected keywords: string[]
    ) {}

    public abstract getScore(): Promise<number>
}
