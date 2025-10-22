import CategoryBadgeColored from './CategoryBadgeColored';
import ButtonLink from '../ui/ButtonLink';
import { FaEye, FaPen } from 'react-icons/fa';
import { type CardProduct } from '../../types';
import { useCategories } from '../../hooks/useCategories';

export default function CardProduct({
    itemId,
    nameProduct,
    categoryId,
    quantity,
    price,
}: CardProduct) {
    const { categoryIdsMap } = useCategories();
    const quantityLimit: number = 10;

    return (
        <div
            className={`flex flex-col justify-between items-start rounded-md shadow-md p-3 ring ring-gray-200 ${
                quantity >= quantityLimit
                    ? 'bg-stone-900 hover:bg-stone-800 '
                    : 'bg-red-800 hover:bg-red-700'
            } transition-colors duration-200  `}
        >
            <div className="w-full space-y-2">
                <h3 className="font-semibold text-white">{nameProduct}</h3>
                <div className="flex gap-2 items-center flex-1 min-w-0 flex-wrap">
                    <CategoryBadgeColored
                        category={categoryIdsMap[categoryId]}
                    />
                    <span
                        className={`text-xs text-center py-1 px-2 rounded-full text-gray-300 ${
                            quantity < quantityLimit && 'bg-red-400'
                        }`}
                    >
                        {quantity >= quantityLimit
                            ? `Qtd: ${quantity}`
                            : `${quantity} restantes`}
                    </span>
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                    <span className="font-medium text-gray-300 truncate">
                        {price}
                    </span>
                    <div className="flex items-center gap-2">
                        <ButtonLink
                            to={`/products/${itemId}/edit`}
                            className="flex items-center justify-center hover:bg-stone-600 p-2 rounded-md transition-colors"
                            icon={<FaPen className="text-gray-200 text-sm" />}
                        />
                        <ButtonLink
                            to={`/products/${itemId}`}
                            icon={<FaEye className="text-gray-200 text-sm" />}
                            className="flex items-center justify-center hover:bg-stone-600 p-2 rounded-md transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
