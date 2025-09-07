import BurgerMenuContext from '../contexts/burgerMenuContext';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export default function BurgerMenuProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setShowMenu(true);
            } else {
                setShowMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleShowMenu = () => {
        setShowMenu((current) => !current);
    };
    const handleCloseMenu = () => {
        setShowMenu(false);
    };

    return (
        <BurgerMenuContext.Provider
            value={{ showMenu, handleShowMenu, handleCloseMenu }}
        >
            {children}
        </BurgerMenuContext.Provider>
    );
}
