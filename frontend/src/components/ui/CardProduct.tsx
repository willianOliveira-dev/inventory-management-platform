import { type CardProduct } from '../../types';
import { FaEye, FaPen } from 'react-icons/fa';

export default function CardProduct({
    nameProduct,
    category,
    quantity,
    price,
    className = '',
}: CardProduct) {
   
    return (
        <div
            className={`flex flex-col justify-between items-start rounded-md shadow-md p-3 bg-stone-900  ring ring-gray-200 ${className}`}
        >
            <div className="w-full space-y-2">
                <h3 className="font-semibold text-white">{nameProduct}</h3>
                <div className="flex gap-2 items-center flex-1 min-w-0 flex-wrap">
                    <span className="text-xs text-center py-1 px-2 rounded-full text-blue-700 bg-blue-100">
                        {category}
                    </span>
                    <span className="text-xs text-center py-1 px-2 rounded-full text-gray-300 ">
                        Qtd: {quantity}
                    </span>
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                    <span className="font-medium text-gray-300 truncate">
                        {price}
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="hover:bg-blue-200 p-2 rounded-md cursor-pointer transition-colors">
                            <FaPen className="text-gray-600 text-sm" />
                        </button>
                        <button className="hover:bg-blue-200 p-2 rounded-md cursor-pointer transition-colors">
                            <FaEye className="text-gray-600 text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
