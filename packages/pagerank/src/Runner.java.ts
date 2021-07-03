import Database from "shared/dist/database/Database.java"
import Graph from "./Graph.java"
import PageRank from "./PageRank.java"
import TerminalUI from "./terminal/TerminalUI.java"

export default class Runner {
    private static readonly ITERATIONS = 1000

    public static async main(args: String[]) {
        const ui = new TerminalUI()
        ui.setTargetIterationsState(Runner.ITERATIONS)
        
        ui.setStatusState("Fetching")
        const graph = await Graph.fromDatabase()
        const pagerank = new PageRank(graph)

        ui.setStatusState("Ranking")
        for (let i = 0; i < Runner.ITERATIONS; i++) {
            ui.setIterationState(i)
            pagerank.nextIteration()
        }
        
        ui.setStatusState("Storing")
        await Graph.toDatabase(graph)

        ui.setStatusState("Idle")
        ui.destroy()
        graph.print()
        
        await Database.getConnection().end()
        process.exit()
    }
}
