import categoryApi from '../api/categoryApi';
import { type LoaderFunctionArgs } from 'react-router-dom';
import { type Category } from '../types';

export default async function categoryLoader({
    params,
}: LoaderFunctionArgs): Promise<Category> {
    const { categoryId } = params;
    try {
        const category = await categoryApi.getCategoryById(categoryId!);
        return category;
    } catch (error: any) {
        throw new Response(error.response.data.message, {
            status: error.response.data.statusCode,
        });
    }
}
