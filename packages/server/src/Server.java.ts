import express, { Express, Request, Response } from "express"
import cors from "cors"
import Search from "search"
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "..", ".env") })

export default class Server {
    private static readonly PORT = process.env.PORT

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
        if (!query || typeof query !== "string") {
            return res.send([])
        }
        const keywords = query.split(" ")
        try {
            const search = await Search.createInstance(keywords)
            const result = await search.getSearchResults()
            return res.send(result)
        } catch (error) {
            console.error(error)
            return res.sendStatus(500)
        }
    }
}
