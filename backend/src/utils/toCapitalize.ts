export default function toCapitalize(text: string): string {
    /**
     * Capitalizes the first letter of each word in a string.
     * @param text The input string to be transformed.
     * @returns A new string with each word's first letter capitalized.
     * @example
     * toCapitalize("hello word") // "Hello Word"
     */
    return text.replace(/\b[a-z]/g, (letra) => letra.toUpperCase());
}
