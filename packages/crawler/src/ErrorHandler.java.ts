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

    public static async withRetriesAsync<T>(
        fn: (...args: any[]) => Promise<T>,
        retries: number
    ) {
        try {
            return await fn()
        } catch (error) {
            if (retries === 0) {
                throw error
            }
            return await ErrorHandler.withRetriesAsync(fn, retries - 1)
        }
    }
}
