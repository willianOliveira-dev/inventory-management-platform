import itemApi from '../api/itemApi';
import { type Item } from '../types';
import { type LoaderFunctionArgs } from 'react-router-dom';

// Loader do React Router -> Ele é uma função que vai carregar os dados necessários para que um rota específica funcione - Famoso DataFetching (Abstração dos Dados).

export default async function productLoader({
    params,
}: LoaderFunctionArgs): Promise<Item> {
    const { itemId } = params;
    try {
        const item = await itemApi.getItemById(itemId!);
        return item;
    } catch (error: any) {
        throw new Response(error.response.data.message, {
            status: error.response.data.statusCode,
        });
    }
}
