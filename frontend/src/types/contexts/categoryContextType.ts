import type React from 'react';
import { type Category } from '../entities/category';

export interface CategoryContextType {
    isLoading: boolean;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    categoryList: string[];
    categoryIdsMap: {
        [categoryId: string]: string;
    };
    categoryNamesMap: {
        [categoryName: string]: string;
    };
    categorySelect: string;
    setCategorySelect: React.Dispatch<React.SetStateAction<string>>;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
    showCategories: boolean;
    setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
    handleShowCategories: () => void;
}
