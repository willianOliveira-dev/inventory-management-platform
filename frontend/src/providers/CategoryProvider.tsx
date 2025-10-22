import CategoryContext from '../contexts/categoryContext';
import categoryApi from '../api/categoryApi';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { type Category } from '../types/entities/category';
import { type ReactNode } from 'react';

export default function CategoryProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySelect, setCategorySelect] =
        useState<string>('Todas Categorias');
    const [active, setActive] = useState<number>(0);
    const [showCategories, setShowCategories] = useState<boolean>(false);

    useEffect(() => {
        try {
            const getAllCategories = async () => {
                const allCategories: Category[] =
                    await categoryApi.getAllMyCategories();
                setCategories(allCategories);
            };
            getAllCategories();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const categoryIdsMap = useMemo(() => {
        const categoryMap: { [categoryId: string]: string } = {};
        categories.forEach(({ category_id, name }) => {
            categoryMap[category_id!] = name;
        });
        return categoryMap;
    }, [categories]);

    const categoryList = useMemo(
        () => [
            'Todas Categorias',
            'Estoque Baixo',
            ...categories.map(({ name }) => name),
        ],
        [categories]
    );

    const categoryNamesMap = useMemo(() => {
        const categoryMap: { [categoryName: string]: string } = {};
        categories.forEach(({ category_id, name }) => {
            categoryMap[name] = category_id!;
        });
        return categoryMap;
    }, [categories]);

    const handleShowCategories = () => {
        return setShowCategories((current) => !current);
    };

    const categoryData = {
        isLoading,
        categories,
        setCategories,
        categorySelect,
        setCategorySelect,
        categoryList,
        categoryIdsMap,
        categoryNamesMap,
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
