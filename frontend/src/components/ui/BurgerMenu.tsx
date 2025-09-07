import { GiHamburgerMenu } from 'react-icons/gi';
import{ useMenu } from '../../hooks/useMenu';

export default function BurgerMenu() {
    const {handleShowMenu} = useMenu()
    return (
        <button onClick={handleShowMenu} className="xl:hidden text-white text-xl cursor-pointer hover:text-violet-300 duration-200">
            <GiHamburgerMenu />
        </button>
    );
}
