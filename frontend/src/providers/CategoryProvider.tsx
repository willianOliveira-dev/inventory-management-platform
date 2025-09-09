import CategoryContext from '../contexts/categoryContext';
import categoryApi from '../api/categoryApi';
import { useState, useEffect } from 'react';
import { type Category } from '../types/entities/category';
import { type ReactNode } from 'react';

export default function CategoryProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [categories, setCategories] = useState<string[]>([
        'All Categories',
        'Low Stock',
    ]);
    const [categorySelect, setCategorySelect] =
        useState<string>('All Categories');
    const [active, setActive] = useState<number>(0);
    const [showCategories, setShowCategories] = useState<boolean>(false);

    useEffect(() => {
        if (categories.length === 2) {
            const getAllCategories = async () => {
                const allCategories: Category[] =
                    await categoryApi.getAllMyCategories();
                const categoriesMap = [
                    ...allCategories.map(({ name }) => name),
                ];
                setCategories((prev) => [...prev, ...categoriesMap]);
            };
            getAllCategories();
        }
    }, []);

    const handleShowCategories = () => {
        return setShowCategories((current) => !current);
    };

    const categoryData = {
        categories,
        categorySelect,
        setCategorySelect,
        active,
        setActive,
        showCategories,
        setShowCategories,
        handleShowCategories,
    };

    return <CategoryContext.Provider value={categoryData}>{children}</CategoryContext.Provider>;
}
