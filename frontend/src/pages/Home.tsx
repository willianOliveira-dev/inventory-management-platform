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
        <section className="flex flex-col gap-6 p-6">
            <div className="relative max-w-150 bg-violet-400 py-6 px-4 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-purple-950/60 to-transparent z-10"></div>
                <img
                    className="absolute top-1/2 -translate-y-1/2 right-0 w-50 h-30 z-0 sm:w-60 sm:h-40"
                    src={imageCollectingData}
                    alt=""
                    loading="lazy"
                />
                <div className="space-y-2 z-10 relative">
                    <h2 className="font-[Vidaloka] text-3xl text-purple-200 tracking-wise">
                        Hello, <span>{user?.name}!</span>
                    </h2>
                    <h1 className="text-white text-4xl font-bold tracking-tighter">
                        Dashboard
                    </h1>
                    <p className="text-white">
                        Welcome to your inventory management system
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full max-lg:grid-cols-2 max-sm:grid-cols-1">
                <ReportCardView
                    label="Total Products"
                    data={items.length}
                    description="Different types of products"
                    icon={
                        <FaBoxOpen className="size-full p-[2px] bg-purple-500" />
                    }
                />
                <ReportCardView
                    label="Total Items"
                    data={totalItems}
                    description="Total data in stock"
                    icon={
                        <LuChartNoAxesCombined className="size-full p-[2px] bg-green-400" />
                    }
                />
                <ReportCardView
                    label={`Added (${days} days)`}
                    data={dayCount}
                    description="Newly added products"
                    icon={
                        <IoCalendarNumberOutline className="size-full p-[2px] bg-blue-400" />
                    }
                />
                <ReportCardView
                    label="Low Stock"
                    data={lowStock}
                    description="Products with less than 10 units"
                    icon={
                        <FiAlertTriangle className="size-full p-[2px] bg-red-400" />
                    }
                />
            </div>
            <div
                className={`flex gap-4 text-white w-full media-screen-851 ${
                    items.length === 0 &&
                    'justify-center ring ring-gray-700/40 rounded-md'
                }`}
            >
                {items.length > 0 ? (
                    <>
                        <div className="flex flex-col w-full lg:w-1/2 p-2 ring ring-gray-700/40 bg-stone-950 rounded-md ">
                            <h2 className="flex gap-2 items-center p-4 tracking-tighter sm:text-xl">
                                <IoCalendarNumberOutline />
                                Recent products (last {days} days)
                            </h2>
                            <div className="flex flex-col gap-4 pb-4 px-4">
                                <div className="flex flex-col gap-2 ">
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
                                        // setNav('/products');
                                        setCategorySelect('All Categories');
                                    }}
                                    className="border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-700 hover:bg-violet-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                    text="See all Products"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full lg:w-1/2 p-2 ring ring-gray-700/40 bg-stone-950 rounded-md">
                            <h2 className="flex gap-2 items-center p-4 tracking-tighter sm:text-xl ">
                                <FiAlertTriangle className="text-red-400" />
                                Low Stock (less than 10 units)
                            </h2>
                            <div className="flex flex-col gap-4 pb-4 px-4">
                                {items.some(
                                    ({ current_quantity }) =>
                                        current_quantity < quantityLimit
                                ) ? (
                                    <>
                                        <div className="flex flex-col gap-2 ">
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
                                                // setNav('/products');
                                                setCategorySelect('Low Stock');
                                            }}
                                            className="border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-700 hover:bg-violet-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                            text="View all low stock items"
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 p-5 md:py-8 md:px-12">
                                        <div className="flex items-center justify-center text-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-900 rounded-full p-5 w-15 h-15 shadow-[0_10px_20px_rgba(255,255,255,0.5] ">
                                            <span>✓</span>
                                        </div>
                                        <h3 className="font-bold text-green-400 text-xl ">
                                            Congratulations!
                                        </h3>
                                        <p className="text-sm text-center">
                                            All product stocks are fully
                                            stocked. Excellent management and
                                            planning work!
                                        </p>
                                        <div className="flex gap-[10px] text-center px-4 py-2 rounded-md bg-amber-200 ">
                                            <div className="flex items-center flex-col gap-[5px]">
                                                <span className="font-bold text-green-600 text-xl">
                                                    100%
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Current Stock
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-col gap-[5px]">
                                                <span className="font-bold text-green-600 text-xl">
                                                    0
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Missing Products
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-col gap-[5px]">
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
                    <div className="flex flex-col items-center gap-4 text-center text-white py-6">
                        <span className="text-3xl text-sky-500 w-10 h-10">
                            <BsBoxSeam className="size-full" />
                        </span>
                        <p>No products found</p>
                        <p className="font-light text-gray-300 text-sm">
                            Start by adding your first product to inventory.
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
        </section>
    );
}
