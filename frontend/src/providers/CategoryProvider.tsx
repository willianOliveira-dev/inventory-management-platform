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
    const [categoryInfo, setCategoryInfo] = useState<{
        [categoryName: string]: string;
    }>({});
    const [categorySelect, setCategorySelect] =
        useState<string>('All Categories');
    const [active, setActive] = useState<number>(0);
    const [showCategories, setShowCategories] = useState<boolean>(false);

    useEffect(() => {
        if (categories.length === 2) {
            const getAllCategories = async () => {
                const allCategories: Category[] =
                    await categoryApi.getAllMyCategories();

                const categoryListName = [
                    ...allCategories.map(({ name }) => name),
                ];

                const categoryMap: { [categoryName: string]: string } = {};

                allCategories.forEach(({ category_id, name }) => {
                    categoryMap[name] = category_id;
                });

                setCategories((prev) => [...prev, ...categoryListName]);
                setCategoryInfo((prev) => ({ ...prev, ...categoryMap }));
            };
            getAllCategories();
        }
    }, []);

    const handleShowCategories = () => {
        return setShowCategories((current) => !current);
    };

    const categoryData = {
        categories,
        categoryInfo,
        categorySelect,
        setCategorySelect,
        active,
        setActive,
        showCategories,
        setShowCategories,
        handleShowCategories,
    };

    return (
        <CategoryContext.Provider value={categoryData}>
            {children}
        </CategoryContext.Provider>
    );
}
