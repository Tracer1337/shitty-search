import PageIndex from "shared/dist/database/models/PageIndex.java"
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
