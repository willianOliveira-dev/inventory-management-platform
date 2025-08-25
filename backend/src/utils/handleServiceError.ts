import AppError from '@errors/AppError';

// utils/handleServiceError.ts
export default function handleServiceError(
    error: unknown,
    contextMessage: string
): never {
    
    if (error instanceof AppError) {
        throw error;
    }

    const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${contextMessage}: ${errorMessage}`);
}
