



class String {

    static toCamelCase(str) {
        if (str) {
            return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
        }
    }
}
export default String