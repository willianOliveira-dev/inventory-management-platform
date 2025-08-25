import bcrypt from 'bcrypt';

export default async function encrypt(data: string): Promise<string> {
    /**
     * Encrypts plaintext data using bcrypt hashing.
     * @param data The plaintext data to be encrypted.
     * @returns A Promise that resolves to the hashed data string.
     * @example
     * await encrypt("myPassword123") // "$2b$10$..."
     */
    const saltRounds: number = 10;

    const hashedData: string = await bcrypt.hash(data, saltRounds);

    return hashedData;
}
