import ReportCardView from '../components/ui/ReportCardView';
import CardProduct from '../components/ui/CardProduct';
import CardLowStock from '../components/ui/CardLowStock';
import ButtonLink from '../components/ui/ButtonLink';
import imageCollectingData from '../assets/collecting-data.webp';
import { useAuth } from '../hooks/useAuth';
import { FaBoxOpen } from 'react-icons/fa';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { FiAlertTriangle } from 'react-icons/fi';

export default function Home() {
    const { user } = useAuth();
    return (
        <section className="flex flex-col gap-6 p-6">
            <div
                data-aos="fade-up"
                data-aos-duration="1400"
                className="relative max-w-150 bg-violet-400 py-6 px-4 rounded-2xl overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-purple-950/60 to-transparent z-10"></div>
                <img
                    className="absolute top-1/2 -translate-y-1/2 right-0 w-50 h-30 z-0 sm:w-60 sm:h-40 sm:fixed"
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
            <div
                data-aos="fade-up"
                data-aos-duration="1600"
                className="grid grid-cols-4 gap-2 w-full max-lg:grid-cols-2 max-sm:grid-cols-1"
            >
                <ReportCardView
                    label="Total Products"
                    data="5"
                    description="Different types of products"
                    icon={
                        <FaBoxOpen className="size-full p-[2px] bg-purple-500" />
                    }
                />
                <ReportCardView
                    label="Total Items"
                    data="60"
                    description="Total data in stock"
                    icon={
                        <LuChartNoAxesCombined className="size-full p-[2px] bg-green-400" />
                    }
                />
                <ReportCardView
                    label="Added (10 days)"
                    data="5"
                    description="Newly added products"
                    icon={
                        <IoCalendarNumberOutline className="size-full p-[2px] bg-blue-400" />
                    }
                />
                <ReportCardView
                    label="Low Stock"
                    data="2"
                    description="Products with less than 10 units"
                    icon={
                        <FiAlertTriangle className="size-full p-[2px] bg-red-400" />
                    }
                />
            </div>
            <div
                data-aos="fade-up"
                data-aos-duration="1800"
                className="flex gap-4 text-white w-full media-screen-851"
            >
                <div className="flex flex-col w-full lg:w-1/2 p-2 ring ring-gray-700/40 bg-stone-950 rounded-md ">
                    <h2 className="flex gap-2 items-center p-4 tracking-tighter sm:text-xl">
                        <IoCalendarNumberOutline />
                        Recent products (last 10 days)
                    </h2>
                    <div className="flex flex-col gap-2 pb-4 px-4">
                        <CardProduct
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantity={12}
                            price={2500.0}
                        />
                        <CardProduct
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantity={12}
                            price={2500.0}
                        />
                        <CardProduct
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantity={12}
                            price={2500.0}
                        />
                        <CardProduct
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantity={12}
                            price={2500.0}
                        />
                        <CardProduct
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantity={12}
                            price={2500.0}
                        />
                    </div>
                    <ButtonLink to={'/products'} text="See all Products" />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 p-2 ring ring-gray-700/40 bg-stone-950 rounded-md">
                    <h2 className="flex gap-2 items-center p-4 tracking-tighter sm:text-xl ">
                        <FiAlertTriangle className="text-red-400" />
                        Low Stock (less than 10 units)
                    </h2>
                    <div className="flex flex-col gap-2 pb-4 px-4">
                        <CardLowStock
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantityBelow={12}
                            price={2500.0}
                        />
                        <CardLowStock
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantityBelow={12}
                            price={2500.0}
                        />
                        <CardLowStock
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantityBelow={12}
                            price={2500.0}
                        />
                        <CardLowStock
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantityBelow={12}
                            price={2500.0}
                        />
                        <CardLowStock
                            nameProduct="MacBook Pro M3"
                            category="Eletrônicos"
                            quantityBelow={12}
                            price={2500.0}
                        />
                    </div>
                    <ButtonLink
                        to={'/products'}
                        text={'View all low stock items'}
                    />
                </div>
            </div>
        </section>
    );
}
