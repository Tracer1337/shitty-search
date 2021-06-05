import fs from "fs"
import path from "path"

export default class Storage {
    private static rootDir = path.join(__dirname, "..")
    private static storageDirName = "storage"

    private filepath: string
    
    constructor(filename: string) {
        this.filepath = this.getFilePath(filename)
    }

    private async createDir(path: string) {
        await fs.promises.mkdir(path, { recursive: true })
    }

    public clear() {
        return this.store("")
    }

    public async store(content: string, append = true) {
        this.createDir(this.getFilePath())
        await fs.promises.writeFile(
            this.filepath,
            append ? content + "\n" : content
        )
    }

    private getFilePath(filename?: string) {
        return filename
            ? path.join(Storage.rootDir, Storage.storageDirName, filename)
            : path.join(Storage.rootDir, Storage.storageDirName)
    }
}
