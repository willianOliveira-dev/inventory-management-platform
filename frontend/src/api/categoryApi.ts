import type { Category } from '../types/entities/category';
import type { CategoryResponse } from '../types/response/categoryResponse';
import api from './api';

const categoryApi = {
    async getAllMyCategories(): Promise<Category[]> {
        const { data: response } = await api.get<CategoryResponse>(
            '/categories/user/my-categories'
        );
        return response.data as unknown as Category[];
    },

    async getCategoryById(categoryId: string): Promise<Category> {
        const { data: response } = await api.get<CategoryResponse>(
            `/categories/${categoryId}`
        );
        return response.data;
    },

    async createCategory({ name }: Category): Promise<Category> {
        const { data: response } = await api.post<CategoryResponse>(
            '/categories',
            { name }
        );
        return response.data;
    },

    async updateCategory(
        { name }: Category,
        categoryId: string
    ): Promise<Category> {
        const { data: response } = await api.patch<CategoryResponse>(
            `/categories/${categoryId}`,
            { name }
        );
        return response.data;
    },

    async deleteCategory(categoryId: string) {
        await api.delete(`/categories/${categoryId}`);
    },
};

export default categoryApi;
