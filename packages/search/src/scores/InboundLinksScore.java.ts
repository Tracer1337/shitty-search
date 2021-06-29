import Score from "./Score.java"

export default class InboundLinksScore extends Score {
    public static higherIsBetter = true
    
    public async getScore() {
        return this.pageData.links.length
    }
}
