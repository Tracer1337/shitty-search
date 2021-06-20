import PageIndex from "database/dist/models/PageIndex.java"
import PageData from "../structures/PageData.java"

export default abstract class Score {
    public static higherIsBetter = true

    constructor(
        protected pageIndex: PageIndex,
        protected pageData: PageData,
        protected keywords: string[]
    ) {}

    public abstract getScore(): Promise<number>
}
