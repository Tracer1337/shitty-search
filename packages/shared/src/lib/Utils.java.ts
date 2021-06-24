export default class Utils {
    public static stringifyList(strings: string[]) {
        return strings
            .map((string) => `'${string}'`)
            .join(",")
    }

    public static lowerStringifyList(strings: string[]) {
        return Utils.stringifyList(
            strings.map((string) => string.toLowerCase())
        )
    }
}
