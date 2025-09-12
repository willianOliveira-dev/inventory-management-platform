import type React from 'react';
import { type Item } from '../';

export interface ItemContextType {
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    removeItemFromState: (itemId: string) => void;
    categoryIdsMap: {
        [categoryId: string]: string;
    };
    error?: string;
    isLoading: boolean;
}
