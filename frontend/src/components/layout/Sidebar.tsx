import Logo from '../../assets/logo.png';
import ExitButton from '../ui/ExitButton';
import { useEffect, useRef } from 'react';
import { useBurgerMenu } from '../../hooks/useBurgerMenu';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaBoxOpen, FaChartBar } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { FiX } from 'react-icons/fi';

export default function Sidebar() {
    const { showMenu, handleCloseMenu } = useBurgerMenu();
    const asideRef = useRef<HTMLElement>(null);
    const location = useLocation();

    useEffect(() => {
        if (showMenu && window.innerWidth <= 1280) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showMenu]);

    const links = [
        { to: '/', label: 'Dashboard', icon: <MdOutlineDashboard /> },
        { to: '/products', label: 'Produtos', icon: <FaBoxOpen /> },
        { to: '/products/new', label: 'Adicionar Produtos', icon: <IoMdAdd /> },
        {
            to: '/categories',
            label: 'Categorias',
            icon: <IoPricetagsOutline />,
        },
        { to: '/reports', label: 'Relatórios', icon: <FaChartBar /> },
    ];

    return (
        <>
            {showMenu && window.innerWidth <= 1280 && (
                <div
                    onClick={handleCloseMenu}
                    className="fixed inset-0 bg-black/80 z-20"
                ></div>
            )}
            <aside
                ref={asideRef}
                className={`${
                    showMenu ? 'translate-x-0' : '-translate-x-full'
                } block w-full max-w-65 absolute top-0 left-0 h-screen py-4 bg-indigo-950 duration-300 xl:translate-x-0 xl:static xl:col-start-1 xl:row-start-1 xl:row-span-3 z-20`}
            >
                <div className="flex flex-col items-center size-full gap-2">
                    <div className="w-full flex justify-between px-5">
                        <h2 className="flex items-center self-start text-2xl text-gray-300 font-bold tracking-tighter md:text-3xl">
                            Stock
                            <span className="bg-gradient-to-r bg-clip-text text-transparent from-violet-500 via-violet-700 to-violet-900">
                                Wise
                            </span>
                            <span className="block w-8 h-8 sm:w-10 sm:h-10">
                                <img
                                    className="block size-full mix-blend-screen"
                                    src={Logo}
                                    alt="Logo"
                                />
                            </span>
                        </h2>
                        <button onClick={handleCloseMenu}>
                            <FiX className="xl:hidden text-2xl text-white cursor-pointer hover:text-violet-300 duration-200" />
                        </button>
                    </div>
                    <div className="h-[2px] w-full bg-gradient-to-r from-violet-300 via-purple-400 to-violet-500"></div>
                    <div className="size-full p-5">
                        <div className="flex flex-col justify-between h-full">
                            <ul className="flex flex-col gap-2">
                                {links.map((link, idx) => {
                                    const isActive =
                                        location.pathname === link.to;
                                    return (
                                        <li key={idx}>
                                            <Link
                                                className={`flex items-center gap-4 text-violet-400 p-2 rounded-md ${
                                                    isActive
                                                        ? 'bg-violet-400/30'
                                                        : 'hover:bg-violet-400/30 duration-400 ease-in'
                                                }`}
                                                to={link.to}
                                                onClick={() => {
                                                    if (
                                                        showMenu &&
                                                        window.innerWidth <=
                                                            1280
                                                    ) {
                                                        handleCloseMenu();
                                                    }
                                                }}
                                                aria-label={`Link ${link.label}`}
                                                aria-current={
                                                    isActive
                                                        ? 'page'
                                                        : undefined
                                                }
                                            >
                                                {link.icon} {link.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <ExitButton />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
