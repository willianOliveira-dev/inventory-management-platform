import ButtonLink from '../components/ui/ButtonLink';
import CategoryBadgeColored from '../components/ui/CategoryBadgeColored';
import formatDateTime from '../utils/format';
import formatPrice from '../utils/formatPrice';
import { useItems } from '../hooks/useItems';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import {
    FaBoxOpen,
    FaHashtag,
    FaDollarSign,
    FaEdit,
    FaRegCalendarAlt,
} from 'react-icons/fa';
import { IoPricetagsOutline } from 'react-icons/io5';
import { IoTrashBinOutline } from 'react-icons/io5';
import { RiHistoryFill } from 'react-icons/ri';
import { LuLetterText } from 'react-icons/lu';
import { FiAlertTriangle } from 'react-icons/fi';
import { type Item } from '../types';

export default function Product() {
    const {
        item_id,
        category_id,
        name,
        current_quantity,
        price_cents,
        description,
        created_at,
        updated_at,
    } = useLoaderData<Item>();

    const { categoryIds } = useItems();

    const hasStock: boolean = useMemo(() => {
        return current_quantity > 0;
    }, [current_quantity]);

    const hasLowStock: boolean = useMemo(() => {
        return current_quantity < 10;
    }, [current_quantity]);

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col justify-center gap-4 py-4 px-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div>
                        <ButtonLink
                            className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer hover:bg-stone-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                            to="/products"
                            text="Back"
                            icon={<FaArrowLeft />}
                        />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-indigo-500 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tighter">
                            {name}
                        </h1>
                        <p className="text-white text-sm md:text-base">
                            Full product details
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <ButtonLink
                        className="flex gap-4 items-center text-white p-2 md:p-3 rounded-md cursor-pointer bg-blue-800 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                        to={`/products/${item_id}/edit`}
                        text="Edit"
                        icon={<FaEdit />}
                    />
                    <button className="flex gap-4 items-center text-white p-2 md:p-3 rounded-md cursor-pointer bg-red-500 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-gray-900">
                        <IoTrashBinOutline /> <span>Remove</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 w-full px-5">
                <div className="w-full lg:w-2/3 space-y-4 p-4 ring ring-gray-700/40 rounded-md">
                    <h2 className="flex items-center gap-2 text-xl text-violet-400">
                        <FaBoxOpen /> <span>Basic Information</span>
                    </h2>
                    <div className="flex flex-col gap-2 w-full text-gray-400">
                        <div className="flex flex-col sm:flex-row">
                            <div className="space-y-2 w-full sm:w-1/2 p-2">
                                <div className="flex items-center gap-2 ">
                                    <FaHashtag />
                                    <span>Quantity in stock</span>
                                </div>
                                <span
                                    className={`${
                                        hasLowStock
                                            ? 'flex items-center gap-4 text-red-500'
                                            : 'text-white'
                                    } text-xl font-bold px-2 `}
                                >
                                    {hasLowStock ? (
                                        <>
                                            {current_quantity}
                                            <span className="py-[2px] px-[8px] text-xs rounded-full text-white bg-red-500">
                                                Low Stock
                                            </span>
                                        </>
                                    ) : (
                                        current_quantity
                                    )}
                                </span>
                            </div>
                            <div className="space-y-2 w-full sm:w-1/2 p-2">
                                <div className="flex items-center gap-2">
                                    <FaDollarSign />
                                    <span>Unit Price</span>
                                </div>
                                <span className="text-white text-xl font-bold px-2">
                                    {formatPrice(price_cents)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 p-2">
                            <div className="flex items-center gap-2">
                                <IoPricetagsOutline />
                                <span>Category</span>
                            </div>
                            <CategoryBadgeColored
                                category={categoryIds[category_id]}
                            />
                        </div>
                        <div className="space-y-2 p-2">
                            <div className="flex items-center gap-2">
                                <LuLetterText />
                                <span>Description</span>
                            </div>
                            <span className="text-white text-sm">
                                {description}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 space-y-4 text-gray-500">
                    <div className="flex flex-col gap-2 ring ring-gray-700/40 p-5">
                        <h3 className="text-violet-400">Product status</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Status:</span>
                                <span
                                    className={`${
                                        hasStock ? 'bg-blue-500' : 'bg-red-500'
                                    } py-[2px] px-[8px] text-xs rounded-full text-white`}
                                >
                                    {hasStock ? 'In Stock' : 'Out of stock'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Total Value</span>
                                <span className="text-white">
                                    {formatPrice(
                                        price_cents * current_quantity
                                    )}
                                </span>
                            </div>
                            {hasLowStock && (
                                <div className="bg-orange-200 rounded-md p-2">
                                    <div className="flex items-center gap-2 text-orange-900">
                                        <FiAlertTriangle className="text-orange-800" />
                                        <span>Attention: Low stock</span>
                                    </div>
                                    <span className="text-xs text-red-600">
                                        Consider restocking this product
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 ring ring-gray-700/40 p-5">
                        <h3 className="flex items-center gap-2 text-violet-400">
                            <RiHistoryFill />
                            <span>History</span>
                        </h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <FaRegCalendarAlt />
                                    <span>Date Added</span>
                                </div>
                                <span className="text-white">
                                    {formatDateTime(created_at!)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <RiHistoryFill />
                                    <span>Last Updated</span>
                                </div>
                                <span className="text-white">
                                    {formatDateTime(updated_at!)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 ring ring-gray-700/40 p-5">
                        <h3 className="text-violet-400">Quick actions</h3>
                        <div className="flex flex-col gap-2">
                            <div>
                                <ButtonLink
                                    className="flex gap-4 items-center justify-center text-white p-2 ring ring-gray-700/40 md:p-3 rounded-md cursor-pointer hover:bg-stone-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    text="Edit Product"
                                    to={`/products/${item_id}/edit`}
                                    icon={<FaEdit />}
                                />
                            </div>
                            <div>
                                <ButtonLink
                                    className="flex gap-4 items-center justify-center text-white p-2 ring ring-gray-700/40 md:p-3 rounded-md cursor-pointer hover:bg-stone-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    text="See all Products"
                                    to="/products"
                                    icon={<FaBoxOpen />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
