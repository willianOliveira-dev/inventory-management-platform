export default function updateData<T extends object>(
    oldData: T,
    newData: Partial<T>
): T {
    /**
     * Updates an object by merging new values into an existing one.
     * Only updates properties that are defined in both objects and not `undefined`.
     * @typeParam T The type of the original object.
     * @param oldData The original object to be updated.
     * @param newData A partial object containing new values to merge.
     * @returns A new object with updated values.
     * @example
     * updateData({ name: "Will", age: 30 }, { age: 31 }) // { name: "Will", age: 31 }
     */
    const updatedData = { ...oldData };
    for (let key in newData) {
        if (newData[key] !== undefined && updatedData[key] !== undefined) {
            updatedData[key] = newData[key];
        }
    }

    return updatedData;
}
