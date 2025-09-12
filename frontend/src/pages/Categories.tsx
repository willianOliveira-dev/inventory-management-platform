import ButtonLink from '../components/ui/ButtonLink';
import CardCategory from '../components/ui/CardCategory';
import { IoMdAdd } from 'react-icons/io';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';

export default function Categories() {
    const { items, categoryIdsMap } = useItems();
    const { categories, categoryInfo } = useCategories();
    const record: Record<string, number> = {};

    categories.slice(2).forEach((category) => {
        record[category] = 0;
    });

    if (items.length > 0) {
        items.forEach(({ category_id }) => {
            const categoryName = categoryIdsMap[category_id!];
            if (categoryIdsMap[category_id!]) {
                record[categoryName]++;
            }
        });
    }

    const productReference = Object.entries(record).map(([category, referance]) => ({category, referance}))

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
            <div className="grid gap-2 grid-cols-1  sm:grid-cols-2 lg:flex">
                {productReference.map(({ category, referance }) => (
                    <CardCategory
                        category={category}
                        category_id={categoryInfo[category]}
                        productReference={referance}
                    />
                ))}
            </div>
        </section>
    );
}
