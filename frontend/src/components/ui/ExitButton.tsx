import { IoMdExit } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ExitButton() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await logout();
        } catch (err: unknown) {
            navigate('/login');
        }
    };
    return (
        <button
            className="flex items-center justify-between text-[15px] cursor-pointer w-full bg-black text-white p-2 rounded-md hover:bg-stone-950 duration-300 "
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Exit button"
        >
            Sign out
            <IoMdExit className="text-xl" />
        </button>
    );
}
