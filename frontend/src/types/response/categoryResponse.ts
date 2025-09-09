import { type Category } from '../entities/category';

export interface CategoryResponse {
    status: 'success' | 'error';
    code: string;
    statusCode: number;
    message: string;
    data: Category;
}
