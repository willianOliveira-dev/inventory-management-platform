import bcrypt from 'bcrypt';

export default async function encryptPassword(
    password: string
): Promise<string> {
    /**
     * Encrypts a plain text password using bcrypt hashing.
     * @param password The plain text password to be encrypted.
     * @returns A Promise that resolves to the hashed password string.
     * @example
     * await encryptPassword("myPassword123") // "$2b$10$..."
     */
    const saltRounds: number = 10;

    const hashedPassord: string = await bcrypt.hash(password, saltRounds);

    return hashedPassord;
}
