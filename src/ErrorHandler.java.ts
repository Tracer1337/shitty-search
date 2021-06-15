import Storage from "./Storage.java"

export default class ErrorHandler {
    private static logStorage = new Storage("logs.txt")

    public static withErrorHandler<T>(fn: (...args: any[]) => T) {
        try {
            return fn()
        } catch (error) {
            this.handleError(error)
        }
    }

    public static async withErrorHandlerAsync<T>(
        fn: (...args: any[]) => Promise<T>
    ) {
        try {
            return await fn()
        } catch (error) {
            this.handleError(error)
        }
    }
    
    public static handleError(error: Error) {
        this.logStorage.store(`${error.stack}\n\n`) 
    }
}
