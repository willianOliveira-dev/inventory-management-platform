import ItemContext from '../contexts/itemContext';
import itemApi from '../api/itemApi';
import { useEffect, useState } from 'react';
import type { Item } from '../types';
import { type ReactNode } from 'react';
export default function ItemProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const getAllMyItems = async () => {
            try {
                const myItems: Item[] = await itemApi.getAllMyItems();
                setItems(myItems);
            } finally {
                setIsLoading(false);
            }
        };
        getAllMyItems();
    }, []);


    const removeItemFromState = (itemId: string) => {
        setItems((prev) => prev.filter((item) => item.item_id !== itemId));
    };

    const itemData = {
        isLoading,
        items,
        setItems,
        removeItemFromState,
    };

    return (
        <ItemContext.Provider value={itemData}>{children}</ItemContext.Provider>
    );
}
