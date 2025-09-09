import { type Item } from '../';

export interface ItemContextType {
    items: Item[];
    categoryIds: {
        [categoryId: string]: string;
    };
    error: string;
    isLoading: boolean;
}
