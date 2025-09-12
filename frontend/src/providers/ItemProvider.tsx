import ItemContext from '../contexts/itemContext';
import categoryApi from '../api/categoryApi';
import itemApi from '../api/itemApi';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import type { Item, Category } from '../types';
import { type ReactNode } from 'react';

export default function ItemProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [items, setItems] = useState<Item[]>([]);
    const [categoryIdsMap, setCategoryIdsMap] = useState<{
        [categoryId: string]: string;
    }>({});
    const [error, setError] = useState<string>('');
    const { getAllMyItems } = itemApi;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const myItems: Item[] = await getAllMyItems();
            setItems(myItems);

            const allCategories: Category[] =
                await categoryApi.getAllMyCategories();
            const categoriesMap: { [categoryId: string]: string } = {};

            allCategories.forEach(({ category_id, name }) => {
                categoriesMap[category_id] = name;
                setCategoryIdsMap(categoriesMap);
            });
        } catch (error: any) {
            setError('Error loading user data.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeItemFromState = (itemId: string) => {
        setItems((prev) => prev.filter((item) => item.item_id !== itemId));
    };

    useEffect(() => {
        if (!user || isLoading) return;
        fetchData();
    }, []);

    const itemData = {
        items,
        setItems,
        removeItemFromState,
        categoryIdsMap,
        error,
        isLoading,
    };

    return (
        <ItemContext.Provider value={itemData}>{children}</ItemContext.Provider>
    );
}
