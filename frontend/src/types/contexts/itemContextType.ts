import type React from 'react';
import { type Item } from '../';

export interface ItemContextType {
    isLoading: boolean;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    removeItemFromState: (itemId: string) => void;
}
