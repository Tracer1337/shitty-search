import Arguments from "./Arguments.java"

export default class Config {
    public static ENTRYPOINT: string
    public static ITERATIONS: number
    public static TIMEOUT: number
    public static THREADS: number
    public static TASKS_PER_THREAD: number

    public static init() {
        this.ENTRYPOINT = Arguments.getArguments().entrypoint
        this.ITERATIONS = Arguments.getArguments().iterations
        this.TIMEOUT = Arguments.getArguments().timeout
        this.THREADS = Arguments.getArguments().threads
        this.TASKS_PER_THREAD = Arguments.getArguments().tasksPerThread
    }
}
