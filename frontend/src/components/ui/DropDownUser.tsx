import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { FaUserEdit } from "react-icons/fa";
import ExitButton from './ExitButton';

export default function DropDownUser() {
    return (
        <div className='flex flex-col gap-4 absolute top-12 bg-stone-900 z-10 w-full rounded-md overflow-hidden'>
            <ul className='flex flex-col'>
                <li className='border-b-[1px] border-white/30 w-full py-[4px] hover:bg-stone-800 duration-200'>
                    <Link className='flex justify-center items-center gap-2' to="/user/profile"><CgProfile/> View Profile</Link>
                </li>
                <li className='border-b-[1px] border-white/30 w-full py-[4px] hover:bg-stone-800 duration-200'>
                    <Link className='flex justify-center items-center gap-2' to="/user/profile/edit"><FaUserEdit/>Edit Profile</Link>
                </li>
            </ul>
            <div className='p-2'>
                <ExitButton />
            </div>
        </div>
    );
}
