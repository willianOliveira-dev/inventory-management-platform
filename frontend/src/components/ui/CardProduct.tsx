import { type CardProduct } from '../../types';
import { FaEye, FaPen } from 'react-icons/fa';
export default function CardProduct({
    nameProduct,
    category,
    quantity,
    price,
    className = '' 
}: CardProduct) {
    return (
        <div className={`flex justify-between items-center rounded-md shadow-xl p-2 ${className}`}>
            <div className="space-y-[3.5px]">
                <h3 className="font-lighten tracking-tighter">{nameProduct}</h3>
                <div className="flex gap-2">
                    <span className="block rounded-full text-[14px] text-center py-[2.5px] px-[5px] text-blue-700 bg-blue-300/80 hover:opacity-90">
                        {category}
                    </span>
                    <span className="font-light text-[13.3px]">
                        Qtd: {quantity}
                    </span>
                    <span className="font-light text-[13.3px]">{price}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="hover:bg-gray-700/40 p-2 rounded-md cursor-pointer">
                    <FaPen />
                </div>
                <div className="hover:bg-gray-700/40 p-2 rounded-md cursor-pointer">
                    <FaEye />
                </div>
            </div>
        </div>
    );
}
