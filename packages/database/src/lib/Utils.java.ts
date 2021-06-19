export default class Utils {
    public static lowerStringifyList(strings: string[]) {
        return strings
            .map((string) => string.toLowerCase())
            .map((string) => `'${string}'`)
            .join(",")
    }
}
