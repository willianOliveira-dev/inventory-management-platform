import { type CardLowStock } from '../../types';
import { FaEye, FaPen } from 'react-icons/fa';

export default function CardLowStock({
    nameProduct,
    category,
    quantityBelow,
    price,
    className = '' 
}: CardLowStock) {

    return (
        <div className={`flex flex-col justify-between items-start rounded-md shadow-md p-3 bg-rose-300/90 ring ring-rose-900 ${className}`}>
            <div className="w-full space-y-2">
                <h3 className="font-semibold text-red-800">{nameProduct}</h3>
                <div className="flex gap-2 items-center flex-1 min-w-0 flex-wrap">
                    <span className="text-xs text-center py-1 px-2 rounded-full text-blue-700 bg-blue-100">
                        {category}
                    </span>
                    <span className="text-xs font-medium rounded-full py-1 px-2 bg-red-100 text-red-700">
                        {quantityBelow} remaining
                    </span>
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                    <span className="font-medium text-gray-900 truncate">{(price)}</span>
                    <div className="flex items-center gap-2">
                        <button className="hover:bg-gray-200 p-2 rounded-md cursor-pointer transition-colors">
                            <FaPen className="text-gray-600 text-sm" />
                        </button>
                        <button className="hover:bg-gray-200 p-2 rounded-md cursor-pointer transition-colors">
                            <FaEye className="text-gray-600 text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}