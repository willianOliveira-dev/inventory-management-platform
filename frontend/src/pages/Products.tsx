import ButtonFilterCategories from '../components/ui/ButtonFilterCategories';
import CategoryBadgeColored from '../components/ui/CategoryBadgeColored';
import formatPrice from '../utils/formatPrice';
import formatDate from '../utils/formatDate';
import ButtonLink from '../components/ui/ButtonLink';
import removeItem from '../utils/removeItem';
import PopUpConfirmation from '../components/ui/PopUpConfirmation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { IoTrashBinOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import { FaBoxOpen, FaEye, FaPen } from 'react-icons/fa';
import { BsBoxSeam } from 'react-icons/bs';
import { type Item } from '../types';

export default function Products() {
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [selectProduct, setSelectProduct] = useState<
        Pick<Item, 'item_id' | 'name'>
    >({ item_id: '', name: '' });
    const [search, setSearch] = useState<string>('');
    const { items, categoryIdsMap, isLoading, removeItemFromState } =
        useItems();
    const categoriesFilter = useCategories();
    const navigate = useNavigate();
    const productsFilter = useMemo(() => {
        return items.filter((item) => {
            const nameMatch: boolean = item.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const categoryMatch: boolean =
                categoriesFilter.categorySelect === 'All Categories' ||
                (categoriesFilter.categorySelect == 'Low Stock' &&
                    item.current_quantity < 10) ||
                categoryIdsMap[item.category_id] ===
                    categoriesFilter.categorySelect;

            return nameMatch && categoryMatch;
        });
    }, [search, items, categoryIdsMap, categoriesFilter.categorySelect]);

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 py-4 px-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Products
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Manage all the products in your inventory
                    </p>
                </div>
                <ButtonLink
                    className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                    to="/products/new"
                    text="Add Product"
                    icon={<IoMdAdd />}
                />
            </header>
            <div className="px-2">
                <div className="flex flex-col items-center sm:flex-row gap-4 py-4 px-4 bg-stone-900 rounded-md shadow-lg">
                    <div className="relative flex-1">
                        <label htmlFor="product-search" className="sr-only">
                            Search products
                        </label>
                        <input
                            id="product-search"
                            className="w-full p-2 pl-10 text-white bg-stone-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product..."
                            aria-describedby="search-help"
                        />
                        <IoSearch
                            className="absolute text-xl text-indigo-500 top-1/2 left-3 transform -translate-y-1/2"
                            aria-hidden="true"
                        />
                        <div id="search-help" className="sr-only">
                            Type product name to search
                        </div>
                    </div>
                    <ButtonFilterCategories />
                </div>
            </div>
            <div className="space-y-2 mt-4 py-4 px-2 bg-stone-900 rounded-md">
                <h2 className="flex items-center px-4 gap-2 text-white text-2xl font-bold tracking-tighter">
                    <FaBoxOpen />
                    <span>Product List ({productsFilter.length})</span>
                </h2>

                <div>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : productsFilter.length > 0 ? (
                        <div className="overflow-x-auto p-4 rounded-xl">
                            <table className="min-w-full text-gray-100">
                                <thead>
                                    <tr className="text-white text-left text-sm uppercase tracking-wider border-b border-gray-700">
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3">Quantity</th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3">Added</th>
                                        <th className="px-4 py-3 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {productsFilter.map(
                                        ({
                                            item_id,
                                            category_id,
                                            description,
                                            name,
                                            price_cents,
                                            current_quantity,
                                            created_at,
                                        }) => (
                                            <tr
                                                key={item_id}
                                                className="text-start hover:bg-stone-700 transition-colors text-gray-100"
                                            >
                                                <td className="px-4 py-3 max-w-[220px]">
                                                    <div className="flex flex-col gap-[2px]">
                                                        <span
                                                            className="font-medium truncate block"
                                                            title={name}
                                                        >
                                                            {name}
                                                        </span>
                                                        <span
                                                            className="text-[12px] text-gray-400 truncate block"
                                                            title={description}
                                                        >
                                                            {description}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <CategoryBadgeColored
                                                        category={
                                                            categoryIdsMap[
                                                                category_id
                                                            ]
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {current_quantity >= 10 ? (
                                                        current_quantity
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-red-500">
                                                            {current_quantity}{' '}
                                                            <span className="text-xs text-white bg-red-500 py-[2px] px-2 rounded-full">
                                                                Low
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {formatPrice(price_cents)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {formatDate(created_at!)}
                                                </td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    <div className="flex justify-center gap-2">
                                                        <ButtonLink
                                                            to={`/products/${item_id}`}
                                                            icon={
                                                                <FaEye className="text-gray-200 text-sm" />
                                                            }
                                                            className="flex items-center justify-center hover:bg-stone-600 p-2 rounded-md transition-colors"
                                                        />
                                                        <ButtonLink
                                                            to={`/products/${item_id}/edit`}
                                                            className="flex items-center justify-center hover:bg-stone-600 p-2 rounded-md transition-colors"
                                                            icon={
                                                                <FaPen className="text-gray-200 text-sm" />
                                                            }
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                setShowPopUp(
                                                                    (current) =>
                                                                        !current
                                                                );
                                                                setSelectProduct(
                                                                    {
                                                                        item_id,
                                                                        name,
                                                                    }
                                                                );
                                                            }}
                                                            className="flex items-center justify-center hover:bg-red-800 p-2 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            <IoTrashBinOutline className="text-red-400 text-sm" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center text-white py-6">
                            <span className="text-3xl text-sky-500 w-10 h-10">
                                <BsBoxSeam className="size-full" />
                            </span>
                            <p>No products found</p>
                            <p className="font-light text-gray-300 text-sm">
                                Try adjusting the filters or creating a new
                                product.
                            </p>
                            <ButtonLink
                                className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer bg-sky-500 hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                                to="/products/new"
                                text="Add Product"
                                icon={<IoMdAdd />}
                            />
                        </div>
                    )}
                </div>
            </div>
            {showPopUp && (
                <PopUpConfirmation
                    setShowPopUp={setShowPopUp}
                    message={`Are you sure you want to remove "${selectProduct.name}" from stock? This action cannot be undone.`}
                    onConfirm={() => {
                        removeItem(selectProduct.item_id!);
                        removeItemFromState(selectProduct.item_id!);
                        navigate('/products');
                        setShowPopUp(false);
                    }}
                />
            )}
            
        </section>
    );
}
