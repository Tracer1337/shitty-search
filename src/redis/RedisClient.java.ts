import redis, { RedisClient as PackageRedisClient, RedisError } from "redis"

export default class RedisClient {
    private static readonly HOST = "localhost"
    private static readonly PORT = 6379

    private static client: PackageRedisClient

    public static getClient() {
        if (this.client) {
            return this.client
        }
        this.client = redis.createClient({
            host: this.HOST,
            port: this.PORT
        })
        this.client.on("error", this.handleError.bind(this))
        return this.client
    }

    private static handleError(error: RedisError) {
        console.error(error)
    }
}
