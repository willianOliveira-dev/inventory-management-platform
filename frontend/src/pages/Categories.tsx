import ButtonLink from '../components/ui/ButtonLink';
import CardCategory from '../components/ui/CardCategory';
import { IoMdAdd } from 'react-icons/io';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { useMemo } from 'react';

export default function Categories() {
    const { items } = useItems();
    const { categoryList, categories, categoryNamesMap, categoryIdsMap } = useCategories();

    const productReference: { categoryName: string; productCount: number }[] =
        useMemo(() => {
            const record: Record<string, number> = {};

            categoryList.slice(2).forEach((category) => {
                record[category] = 0;
            });

            items.forEach(({ category_id }) => {
                const categoryName = categoryIdsMap[category_id];
                if (categoryName) {
                    record[categoryName] = (record[categoryName] || 0) + 1;
                }
            });

            return Object.entries(record).map(
                ([categoryName, productCount]) => ({
                    categoryName,
                    productCount,
                })
            );
        }, [items, categoryList, categoryIdsMap, categories]);

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 py-4 px-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Categories
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Organize your products by categories
                    </p>
                </div>
                <ButtonLink
                    className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                    to="/categories/new"
                    text="New Category"
                    icon={<IoMdAdd />}
                />
            </header>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap">
                {productReference.map(({ categoryName, productCount }, idx) => {
                    return (
                        <CardCategory
                            key={idx}
                            category={categoryName}
                            category_id={categoryNamesMap[categoryName]}
                            productCount={productCount}
                        />
                    );
                })}
            </div>
        </section>
    );
}
