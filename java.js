const { program } = require("commander")
const path = require("path")

program
    .version("1.0.0")
    .option("-classpath <path>", "class search path of directories")

const options = program.parse().opts()
const [className] = program.args

if (!className) {
    throw new Error("No class specified")
}

const classFilename = className + ".java"
const classPath = path.join(__dirname, options.Classpath, classFilename)

const classModule = require(classPath)
const main = classModule.main || classModule.default.main

if (!main) {
    throw new Error("Missing main method in class " + className)
}

main(program.args.slice(1))
