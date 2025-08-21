export default function extractObjectValues<T, K extends keyof T>(
    reqBody: T,
    keysColumn: K[]
): T[K][] {
    /**
     * Extracts values from an object based on the specified keys.
     * @typeParam T The type of the input object.
     * @typeParam K The keys to extract from the object.
     * @param reqBody The object from which values will be extracted.
     * @param keysColumn An array of keys to extract from the object.
     * @returns An array of values corresponding to the specified keys.
     */
    return keysColumn.reduce((acc: T[K][], currentValue: K) => {
        acc.push(reqBody[currentValue]);
        return acc;
    }, []);
}
