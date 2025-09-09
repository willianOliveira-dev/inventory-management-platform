import { GiHamburgerMenu } from 'react-icons/gi';
import { useBurgerMenu } from '../../hooks/useBurgerMenu';

export default function BurgerMenu() {
    const { handleShowMenu } = useBurgerMenu();
    return (
        <button
            onClick={handleShowMenu}
            className="xl:hidden text-white text-xl cursor-pointer hover:text-violet-300 duration-200"
        >
            <GiHamburgerMenu />
        </button>
    );
}
