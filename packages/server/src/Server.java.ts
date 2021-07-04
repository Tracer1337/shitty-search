import express, { Express, Request, Response } from "express"
import cors from "cors"
import { makeBadge } from "badge-maker"
import Search from "search"
import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import { performance } from "perf_hooks"
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "..", ".env") })
import PaginatedResponse from "./responses/PaginatedResponse.java"
import PerformanceResponse from "./responses/PerformanceResponse.java"

export default class Server {
    private static readonly PORT = process.env.PORT
    private static readonly ITEMS_PER_PAGE = 20

    public static async main(args: string[]) {
        const server = new Server()
        await server.start()
        console.log(`Server is running on port ${Server.PORT}`)
    }

    public async start() {
        return new Promise<void>(async (resolve) => {
            const app = express()
            this.boot(app)
            app.listen(Server.PORT, resolve)
        })
    }

    private boot(app: Express) {
        app.use(cors())
        app.get("/search", this.handleSearch.bind(this))
        app.get("/index-size", this.handleIndexSize.bind(this))
        app.get("/index-badge", this.handleIndexBadge.bind(this))
    }

    private async handleSearch(req: Request, res: Response) {
        const query = req.query.q as string
        let page = parseInt(req.query.page as any)
        page = Number.isFinite(page) && page > 0 ? page : 1
        page -= 1

        if (query.length === 0) {
            return res.send([])
        }

        const keywords = query
            .split(" ")
            .map((word) => encodeURIComponent(word))

        try {
            const t0 = performance.now()

            const search = await Search.createInstance(keywords)
            const result = await search.getSearchResults()

            const t1 = performance.now()

            const response = new PerformanceResponse({
                duration: t1 - t0,
                size: result.length,
                data: new PaginatedResponse({
                    items: result,
                    page,
                    itemsPerPage: Server.ITEMS_PER_PAGE
                })
            })
            return res.send(response)
        } catch (error) {
            console.error(error)
            return res.sendStatus(500)
        }
    }

    private async handleIndexSize(req: Request, res: Response) {
        const size = await PageIndexRepository.getCrawledPagesSize()
        return res.send({ size })
    }
    
    private async handleIndexBadge(req: Request, res: Response) {
        const size = await PageIndexRepository.getCrawledPagesSize()
        const badge = makeBadge({
            label: "Indexed Pages",
            message: size.toString(),
            color: "brightgreen"
        })
        return res.contentType("image/svg+xml").send(badge)
    }
}
