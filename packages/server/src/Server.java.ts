import express, { Express, Request, Response } from "express"
import cors from "cors"
import Search from "search"
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "..", ".env") })
import PaginatedResponse from "./PaginatedResponse.java"

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
            const search = await Search.createInstance(keywords)
            const result = await search.getSearchResults()
            const response = new PaginatedResponse({
                items: result,
                page,
                itemsPerPage: Server.ITEMS_PER_PAGE
            })
            return res.send(response)
        } catch (error) {
            console.error(error)
            return res.sendStatus(500)
        }
    }
}
