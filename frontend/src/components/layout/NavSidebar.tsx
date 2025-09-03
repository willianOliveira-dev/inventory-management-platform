import { MdOutlineDashboard } from 'react-icons/md';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaBoxOpen } from 'react-icons/fa';
import { FaChartBar } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function NavSideBar() {
    const [active, setActive] = useState<number>(0);

    const links = [
        { to: '/', label: 'Dashboard', icon: <MdOutlineDashboard /> },
        { to: '/products', label: 'Products', icon: <FaBoxOpen /> },
        { to: '/products/new', label: 'Add Products', icon: <IoMdAdd /> },
        {
            to: '/categories',
            label: 'Categories',
            icon: <IoPricetagsOutline />,
        },
        { to: '/reports', label: 'Reports', icon: <FaChartBar /> },
    ];
    return (
        <div>
            <ul className="flex flex-col gap-2">
                {links.map((link, idx) => {
                    return (
                        <li key={idx}>
                            <Link
                                className={`flex items-center gap-4 text-violet-400 p-2 rounded-xl text-violet-300 ${
                                    active === idx
                                        ? 'bg-violet-400/30'
                                        : 'hover:bg-violet-400/30 duration-400 ease-in'
                                }`}
                                to={link.to}
                                onClick={() => setActive(idx)}
                                aria-label={`${link.label} Link`}
                            >
                                {link.icon} {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
