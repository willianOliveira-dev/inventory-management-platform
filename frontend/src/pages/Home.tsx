import ReportCardView from '../components/ui/ReportCardView';
import CardProduct from '../components/ui/CardProduct';
import ButtonLink from '../components/ui/ButtonLink';
import imageCollectingData from '../assets/collecting-data.webp';
import generateChartData from '../utils/generateChartData';
import { useMemo } from 'react';
import { useItems } from '../hooks/useItems';
import { useAuth } from '../hooks/useAuth';
import { BsBoxSeam } from 'react-icons/bs';
import { FaBoxOpen } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
// import { useNav } from '../hooks/useNav';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { FiAlertTriangle } from 'react-icons/fi';
import { useCategories } from '../hooks/useCategories';
import formatPrice from '../utils/formatPrice';

export default function Home() {
    const { user } = useAuth();
    const { items } = useItems();
    const { setCategorySelect } = useCategories();
    const days: number = 10;
    const quantityLimit: number = 10;

    const [_, dayCount] = useMemo(
        () => generateChartData(items, days),
        [items]
    );

    const totalItems = useMemo(() => {
        return items.reduce(
            (prev, currentValue) => prev + currentValue.current_quantity,
            0
        );
    }, [items]);

    const lowStock = useMemo(() => {
        return items.filter(
            ({ current_quantity }) => current_quantity < quantityLimit
        ).length;
    }, [items]);

    return (
        <section className="flex flex-col gap-6 p-6 animate-fadeIn">
            <div className="relative max-w-150 bg-gradient-to-r from-purple-700 to-violet-500 py-8 px-6 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/70 to-transparent z-10"></div>
                <img
                    className="absolute top-1/2 -translate-y-1/2 right-0 w-50 h-30 z-0 sm:w-64 sm:h-44 opacity-90"
                    src={imageCollectingData}
                    alt=""
                    loading="lazy"
                />
                <div className="space-y-3 z-10 relative">
                    <h2 className="font-[Vidaloka] text-3xl text-purple-100 tracking-wise">
                        Hello, <span className="text-white">{user?.name}!</span>
                    </h2>
                    <h1 className="text-white text-5xl font-bold tracking-tighter">
                        Dashboard
                    </h1>
                    <p className="text-purple-100 text-lg">
                        Welcome to your inventory management system
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full max-lg:grid-cols-2 max-sm:grid-cols-1">
                <ReportCardView
                    label="Total Products"
                    data={items.length}
                    description="Different types of products"
                    icon={
                        <FaBoxOpen className="size-full p-[5px] bg-purple-500 rounded-full" />
                    }
                />
                <ReportCardView
                    label="Total Items"
                    data={totalItems}
                    description="Total data in stock"
                    icon={
                        <LuChartNoAxesCombined className="size-full  p-[5px] bg-green-400 rounded-full" />
                    }
                />
                <ReportCardView
                    label={`Added (${days} days)`}
                    data={dayCount}
                    description="Newly added products"
                    icon={
                        <IoCalendarNumberOutline className="size-full p-[5px] bg-blue-400 rounded-full" />
                    }
                />
                <ReportCardView
                    label="Low Stock"
                    data={lowStock}
                    description="Products with less than 10 units"
                    icon={
                        <FiAlertTriangle className="size-full p-[5px] bg-red-400 rounded-full" />
                    }
                />
            </div>

            <div
                className={`flex gap-6 text-white w-full media-screen-851 ${
                    items.length === 0 &&
                    'justify-center ring-1 ring-gray-600 rounded-xl shadow-md'
                }`}
            >
                {items.length > 0 ? (
                    <>
                        <div className="flex flex-col w-full lg:w-1/2 p-4 ring-1 ring-gray-600 bg-stone-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="flex gap-2 items-center p-4 tracking-tighter text-xl font-semibold border-b border-gray-700 pb-3">
                                <IoCalendarNumberOutline className="text-blue-400" />
                                Recent products (last {days} days)
                            </h2>
                            <div className="flex flex-col gap-4 pb-4 px-2 mt-2">
                                <div className="flex flex-col gap-3">
                                    {items.map(
                                        (
                                            {
                                                item_id,
                                                name,
                                                category_id,
                                                current_quantity,
                                                price_cents,
                                            },
                                            idx
                                        ) => {
                                            if (
                                                idx <= 5 &&
                                                current_quantity > quantityLimit
                                            )
                                                return (
                                                    <CardProduct
                                                        key={item_id!}
                                                        itemId={item_id!}
                                                        nameProduct={name}
                                                        categoryId={category_id}
                                                        quantity={
                                                            current_quantity
                                                        }
                                                        price={formatPrice(
                                                            price_cents
                                                        )}
                                                    />
                                                );
                                        }
                                    )}
                                </div>
                                <ButtonLink
                                    to={'/products'}
                                    onClick={() => {
                                        setCategorySelect('All Categories');
                                    }}
                                    className="border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-md hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                    text="See all Products"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full lg:w-1/2 p-4 ring-1 ring-gray-600 bg-stone-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="flex gap-2 items-center p-4 tracking-tighter text-xl font-semibold border-b border-gray-700 pb-3">
                                <FiAlertTriangle className="text-red-400" />
                                Low Stock (less than 10 units)
                            </h2>
                            <div className="flex flex-col gap-4 pb-4 px-2 mt-2">
                                {items.some(
                                    ({ current_quantity }) =>
                                        current_quantity < quantityLimit
                                ) ? (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            {items.map(
                                                (
                                                    {
                                                        item_id,
                                                        name,
                                                        category_id,
                                                        current_quantity,
                                                        price_cents,
                                                    },
                                                    idx
                                                ) => {
                                                    if (
                                                        idx <= 5 &&
                                                        current_quantity <
                                                            quantityLimit
                                                    )
                                                        return (
                                                            <CardProduct
                                                                key={item_id!}
                                                                itemId={
                                                                    item_id!
                                                                }
                                                                nameProduct={
                                                                    name
                                                                }
                                                                categoryId={
                                                                    category_id
                                                                }
                                                                quantity={
                                                                    current_quantity
                                                                }
                                                                price={formatPrice(
                                                                    price_cents
                                                                )}
                                                            />
                                                        );
                                                }
                                            )}
                                        </div>
                                        <ButtonLink
                                            to={'/products'}
                                            onClick={() => {
                                                setCategorySelect('Low Stock');
                                            }}
                                            className="justify-self-end border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-md hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                            text="View all low stock items"
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 p-6 md:py-8 md:px-12 bg-gradient-to-b from-stone-800 to-stone-900 rounded-lg mt-2">
                                        <div className="flex items-center justify-center text-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-full p-5 w-16 h-16 shadow-lg">
                                            <span>✓</span>
                                        </div>
                                        <h3 className="font-bold text-green-400 text-xl">
                                            Congratulations!
                                        </h3>
                                        <p className="text-sm text-center text-gray-300">
                                            All product stocks are fully
                                            stocked. Excellent management and
                                            planning work!
                                        </p>
                                        <div className="flex gap-5 text-center px-5 py-3 rounded-md bg-amber-100 shadow-inner mt-2">
                                            <div className="flex items-center flex-col gap-1">
                                                <span className="font-bold text-green-600 text-xl">
                                                    100%
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Current Stock
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-col gap-1">
                                                <span className="font-bold text-green-600 text-xl">
                                                    0
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Missing Products
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-col gap-1">
                                                <span className="font-bold text-green-600 text-xl">
                                                    100%
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Availability
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-5 text-center text-white py-10 px-6 bg-stone-900 rounded-xl shadow-md w-full">
                        <span className="text-3xl text-sky-400 w-12 h-12">
                            <BsBoxSeam className="size-full" />
                        </span>
                        <h3 className="font-medium text-lg">
                            No products found
                        </h3>
                        <p className="font-light text-gray-300 text-sm">
                            Start by adding your first product to inventory.
                        </p>
                        <ButtonLink
                            className="flex gap-2 items-center text-white p-3 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900 mt-2"
                            to="/products/new"
                            text="Add Product"
                            icon={<IoMdAdd />}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
