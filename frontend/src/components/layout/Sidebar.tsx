import Logo from '../../assets/logo.png';
import NavSidebar from './NavSidebar';

export default function Sidebar() {
    return (
        <aside className=" w-full max-w-62 py-4 bg-stone-950">
            <div className="flex flex-col items-center size-full gap-2">
                <h2 className="flex items-center self-start text-3xl text-gray-300 font-bold px-5 tracking-tighter">
                    Stock<span className="bg-gradient-to-r bg-clip-text text-transparent from-violet-500 via-violet-700 to-violet-900">Wise</span>
                    <span className="block w-10 h-10">
                        <img
                            className="block size-full mix-blend-screen"
                            src={Logo}
                            alt="Logo"
                        />
                    </span>
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-violet-300 via-purple-400 to-violet-500"></div>
                <div className="flex flex-col justify-between size-full p-5">
                    <NavSidebar />
                    <div className="bg-violet-500/20 p-2 rounded-xl text-gray-300 ">
                        <h3 className="text-sm">Inventory System</h3>
                        <p className="text-xs">
                            Manage your inventory with ease
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
