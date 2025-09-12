import itemApi from '../api/itemApi';

export default async function removeItem(itemId: string): Promise<void> {
    try {
        await itemApi.deleteItem(itemId);
        return;
    } catch (error:any) {
        throw new Response(error.response.data.message, {status: error.response.data.statusCode});
    }
}
