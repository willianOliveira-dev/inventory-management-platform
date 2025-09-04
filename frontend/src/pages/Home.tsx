import ReportCardView from "../components/ui/ReportCardView";
import CardProduct from "../components/ui/CardProduct";
import CardLowStock from "../components/ui/CardLowStock";
import { FaBoxOpen } from 'react-icons/fa';
import { LuChartNoAxesCombined } from "react-icons/lu";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import ButtonLink from "../components/ui/ButtonLink";


export default function Home() {
    return (
        <section className="flex flex-col gap-6 p-6 w-full">
            <div data-aos="fade-up" data-aos-duration="1400" className="space-y-2 w-full">
                <h1 className="text-white text-3xl font-bold tracking-tighter">Dashboard</h1>
                <p className="text-white">
                    Welcome to your inventory management system
                </p>
            </div>
            <div data-aos="fade-up" data-aos-duration="1600" className="grid grid-cols-4 gap-2 w-full">
                <ReportCardView label="Total Products" data="5" description="Different types of products" icon={<FaBoxOpen/>}/>
                <ReportCardView label="Total Items" data="60" description="Total data in stock" icon={<LuChartNoAxesCombined />}/>
                <ReportCardView label="Added (10 days)" data="5" description="Newly added products" icon={<IoCalendarNumberOutline/>}/>
                <ReportCardView label="Low Stock" data="2" description="Products with less than 10 units" icon={<FiAlertTriangle/>} />
            </div>
            <div data-aos="fade-up" data-aos-duration="1800" className="flex gap-4 text-white w-full">
                <div className="flex flex-col w-1/2 p-2 ring ring-gray-700/40 bg-stone-950 rounded-md ">
                    <h2 className="flex gap-2 items-center text-xl p-4 tracking-tighter"><IoCalendarNumberOutline/>Recent products (last 10 days)</h2>
                    <div className="flex flex-col gap-2 pb-4 px-4">
                        <CardProduct className="bg-gray-500/10"  nameProduct="MacBook Pro M3" category="Eletrônicos" quantity={12} price="R$ 2500.00"/>
                        <CardProduct className="bg-gray-500/10" nameProduct="MacBook Pro M3" category="Eletrônicos" quantity={12} price="R$ 2500.00"/>
                        <CardProduct className="bg-gray-500/10" nameProduct="MacBook Pro M3" category="Eletrônicos" quantity={12} price="R$ 2500.00"/>
                        <CardProduct className="bg-gray-500/10" nameProduct="MacBook Pro M3" category="Eletrônicos" quantity={12} price="R$ 2500.00"/>
                        <CardProduct className="bg-gray-500/10" nameProduct="MacBook Pro M3" category="Eletrônicos" quantity={12} price="R$ 2500.00"/>
                    </div>
                    <ButtonLink to={'/products'} text="See all Products"/>
                </div>
                <div className="flex flex-col w-1/2 p-2 ring ring-gray-700/40 bg-stone-950 rounded-md">
                    <h2 className="flex gap-2 items-center text-xl p-4 tracking-tighter "><FiAlertTriangle className="text-orange-500"/>Low Stock (less than 10 units)</h2>
                    <div className="flex flex-col gap-2 pb-4 px-4">
                        <CardLowStock className = 'bg-orange-400/50 ring ring-orange-700'  nameProduct="MacBook Pro M3" category="Eletrônicos" quantityBelow={12} price="R$ 2500.00"/>
                        <CardLowStock className = 'bg-orange-400/50 ring ring-orange-700'  nameProduct="MacBook Pro M3" category="Eletrônicos" quantityBelow={12} price="R$ 2500.00"/>
                        <CardLowStock className = 'bg-orange-400/50 ring ring-orange-700'  nameProduct="MacBook Pro M3" category="Eletrônicos" quantityBelow={12} price="R$ 2500.00"/>
                        <CardLowStock className = 'bg-orange-400/50 ring ring-orange-700'  nameProduct="MacBook Pro M3" category="Eletrônicos" quantityBelow={12} price="R$ 2500.00"/>
                        <CardLowStock className = 'bg-orange-400/50 ring ring-orange-700'  nameProduct="MacBook Pro M3" category="Eletrônicos" quantityBelow={12} price="R$ 2500.00"/>
                    </div>
                    <ButtonLink to={"/products"} text={"View all low stock items"}/>
                </div>
            </div>
        </section>
    );
}
