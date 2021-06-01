const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const SRC_DIR = path.join(__dirname, "..", "src")
const OUT_DIR = path.join(__dirname, "..", "out")

function readDirRecursive(dir) {
    return fs.readdirSync(dir)
        .map((filename) =>
            fs.statSync(path.join(dir, filename)).isDirectory()
                ? readDirRecursive(dir + "/" + filename)
                : path.join(dir, filename)
        )
        .flat()
}

execSync(`javac ${readDirRecursive(SRC_DIR).join(" ")} -d ${OUT_DIR}`)
