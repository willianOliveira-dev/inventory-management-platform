import Logo from '../../assets/logo.png';
import Avatar from 'react-avatar';
import NavSidebar from './NavSidebar';
import { useNavigate } from 'react-router-dom';
import { IoMdExit } from 'react-icons/io';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
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
        <aside className=" w-full max-w-65 py-4 bg-stone-950">
            <div className="flex flex-col items-center size-full gap-2">
                <h2 className="flex items-center self-start text-3xl text-gray-300 font-bold px-5 tracking-tighter">
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
                <div className="h-[1px] w-full bg-gradient-to-r from-violet-300 via-purple-400 to-violet-500"></div>
                <div className="flex flex-col justify-between size-full p-5">
                    <NavSidebar />
                    <div className="flex justify-between bg-violet-500/20 px-4 py-2 rounded-md text-gray-300 ">
                        <div className="flex gap-2 items-center">
                            <Avatar name={user?.name!} size="40"  round={true} />
                            <h3 className="text-sm">{user?.name!}</h3>
                        </div>
                        <button className="text-xl cursor-pointer" onClick={handleLogout} title='Exit' aria-label='Exit button'>
                            <IoMdExit />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
