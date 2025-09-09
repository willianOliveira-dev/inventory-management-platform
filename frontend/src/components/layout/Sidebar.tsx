import Logo from '../../assets/logo.png';
import NavSidebar from './NavSidebar';
import CloseMenu from '../ui/CloseMenu';
import { useBurgerMenu } from '../../hooks/useBurgerMenu';
import { useEffect, useRef } from 'react';

export default function Sidebar() {
    const { showMenu, handleCloseMenu } = useBurgerMenu();
    const asideRef = useRef<HTMLElement>(null);

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
                    <div className="flex items-center justify-between w-full px-5">
                        <h2 className="flex items-center self-start text-3xl text-gray-300 font-bold tracking-tighter">
                            Stock
                            <span className="bg-gradient-to-r bg-clip-text text-transparent from-violet-500 via-violet-700 to-violet-900">
                                Wise
                            </span>
                            <span className="block w-10 h-10">
                                <img
                                    className="block size-full mix-blend-screen"
                                    src={Logo}
                                    alt="Logo"
                                />
                            </span>
                        </h2>
                        <CloseMenu onClick={handleCloseMenu} />
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-violet-300 via-purple-400 to-violet-500"></div>
                    <div className="size-full p-5">
                        <NavSidebar />
                    </div>
                </div>
            </aside>
        </>
    );
}
