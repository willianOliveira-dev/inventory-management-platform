import BurgerMenu from '../ui/BurgerMenu';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
    const { user } = useAuth();
    const dateNow: number = Date.now();
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const dateFormat: string = dateTimeFormat.format(dateNow);
    return (
        <header className="flex xl:col-start-2 p-2 bg-stone-950 shadow-xl/50 ">
            <BurgerMenu />
            <div className="flex items-center justify-end w-full py-2 px-4 sm:justify-between">
                <span className="hidden bg-gradient-to-r bg-clip-text from-violet-400 via-violet-500 to-violet-700 text-transparent sm:block">
                    {dateFormat}
                </span>
                <div className=" relative flex items-center gap-2 text-white px-2 py-[4px]">
                    <span className="flex justify-center items-center w-6 h-6 bg-violet-400 rounded-full">
                        <FaUser />
                    </span>
                    <span className="font-light">{user?.name}</span>
                </div>
            </div>
        </header>
    );
}
