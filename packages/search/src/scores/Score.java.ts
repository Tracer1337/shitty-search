import PageIndex from "shared/dist/database/models/PageIndex.java"
import Word from "../../../shared/dist/database/models/Word.java"
import PageData from "../structures/PageData.java"

export default abstract class Score {
    public static higherIsBetter = true

    constructor(
        protected pageIndex: PageIndex,
        protected pageData: PageData,
        protected keywords: Word[]
    ) {}

    public abstract getScore(): Promise<number>
}
