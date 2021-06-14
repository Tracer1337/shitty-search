import os from "os"

export default class Config {
    public static readonly ENTRYPOINT = "https://easymeme69.com"
    public static readonly ITERATIONS = 1000
    public static readonly TIMEOUT = 1000
    public static readonly THREADS = os.cpus().length
    public static readonly TASKS_PER_THREAD = 5
}
