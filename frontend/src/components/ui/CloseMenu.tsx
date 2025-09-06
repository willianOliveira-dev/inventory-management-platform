import { FiX } from 'react-icons/fi';
export default function CloseMenu({ onClick }: { onClick?: () => void }) {
    return (
        <button onClick={onClick}>
            <FiX className="xl:hidden text-2xl text-white cursor-pointer hover:text-violet-300 duration-200" />
        </button>
    );
}
