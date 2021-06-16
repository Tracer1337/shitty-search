import { Command } from "commander"
import os from "os"

export default class Arguments {
    private static args: {
        entrypoint: string,
        iterations: number,
        timeout: number,
        threads: number,
        tasksPerThread: number
    }

    public static parseArguments(input: string[]) {
        function safeParseInt(input: any, defaultValue: number) {
            const result = parseInt(input, 10)
            if (!Number.isNaN(result)) {
                return result
            } else {
                return defaultValue
            }
        }

        const program = new Command()
        this.args = program
            .option(
                "-e, --entrypoint <entrypoint>",
                "First url that will be crawled",
                "https://easymeme69.com"
            )
            .option(
                "-i, --iterations <iterations>",
                "Iterations before the crawler is throttled",
                safeParseInt,
                1000
            )
            .option(
                "-t, --timeout <timeout>",
                "Duration the crawler will wait when throttled (ms)",
                safeParseInt,
                10000
            )
            .option(
                "-n, --threads <threads>",
                "Amount of worker threads used",
                safeParseInt,
                os.cpus().length
            )
            .option(
                "--tasksPerThread <tasksPerThread>",
                "Amount of concurrent tasks per worker thread",
                safeParseInt,
                8
            )
            .parse([".", "..", ...input])
            .opts() as (typeof Arguments)["args"]
    }
    
    public static getArguments() {
        return this.args
    }
}
