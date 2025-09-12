import ButtonLink from '../ui/ButtonLink';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa';

export default function CardCategory({
    category_id,
    category,
    productReference,
}: {
    category_id: string;
    category: string;
    productReference: number;
}) {
    return (
        <div className="border space-y-2 rounded-2xl shadow-sm p-4 w-full hover:scale-101 duration-300 bg-white  lg:w-64">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IoPricetagsOutline className="w-4 h-4 text-gray-500" />
                    <h2 className="font-semibold text-gray-800">{category}</h2>
                </div>
                <span className="text-sm text-gray-500">
                    {productReference}
                </span>
            </div>

            <div className="flex gap-2 items-end justify-between">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FaBoxOpen className="w-4 h-4" />
                    <span>{productReference} produtos</span>
                </div>
                <ButtonLink
                    className="flex items-center justify-center text-black p-[5px] ring ring-gray-700/40 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                    to={`/categories/${category_id}/edit`}
                    icon={<FaEdit />}
                />
            </div>
        </div>
    );
}
