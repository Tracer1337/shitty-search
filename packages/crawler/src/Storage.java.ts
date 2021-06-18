import fs from "fs"
import path from "path"

export default class Storage {
    private static readonly ROOT_DIR = path.join(__dirname, "..")
    private static readonly STORAGE_DIR_NAME = "storage"

    private filepath: string
    
    constructor(filename: string) {
        this.filepath = this.getFilePath(filename)
    }

    private async createDir(path: string) {
        await fs.promises.mkdir(path, { recursive: true })
    }

    public async clear() {
        try {
            await fs.promises.writeFile(this.filepath, "")
        } catch {}
    }

    public async store(content: string, append = true) {
        await this.createDir(this.getFilePath())
        await fs.promises.appendFile(
            this.filepath,
            append ? content + "\n" : content
        )
    }

    private getFilePath(filename?: string) {
        return filename
            ? path.join(Storage.ROOT_DIR, Storage.STORAGE_DIR_NAME, filename)
            : path.join(Storage.ROOT_DIR, Storage.STORAGE_DIR_NAME)
    }
}
