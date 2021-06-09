import RedisClient from "../RedisClient.java"

export default class BusyTasksHandler {
    private static readonly key = "busy_tasks"

    public static async create(url: string) {
        return new Promise<number>((resolve, reject) => {
            RedisClient.getClient().sadd(this.key, url, (err, res) => {
                if (err) {
                    return void reject(err)
                }
                resolve(res)
            })
        })
    }

    public static async remove(url: string) {
        return new Promise<number>((resolve, reject) => {
            RedisClient.getClient().srem(this.key, url, (err, res) => {
                if (err) {
                    return void reject(err)
                }
                resolve(res)
            })
        })
    }

    public static async isBusy(url: string) {
        return new Promise<number>((resolve, reject) => {
            RedisClient.getClient().sismember(this.key, url, (err, res) => {
                if (err) {
                    return void reject(err)
                }
                resolve(res)
            })
        })
    }
}
