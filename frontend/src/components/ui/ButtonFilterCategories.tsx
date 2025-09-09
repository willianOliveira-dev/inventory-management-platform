import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { CiFilter } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';
import { useCategories } from '../../hooks/useCategories';

export default function ButtonFilterCategories() {
    
    const {
        active,
        setActive,
        categories,
        categorySelect,
        setCategorySelect,
        setShowCategories,
        showCategories,
        handleShowCategories,
    } = useCategories();

    return (
        <div className="relative">
            <button
                aria-haspopup="true"
                aria-expanded={showCategories}
                aria-controls="menu1"
                onClick={handleShowCategories}
                className="flex justify-between items-center gap-2 text-white p-2 ring ring-gray-200/30 cursor-pointer rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <CiFilter aria-hidden="true" />
                <span>{categorySelect}</span>
                <IoIosArrowDown aria-hidden="true" />
            </button>

            {showCategories && (
                <div className="absolute top-full mt-2 left-0 bg-zinc-800 rounded-sm shadow-lg z-10">
                    <ul
                        role="menu"
                        id="menu1"
                        className="flex flex-col gap-2 p-2 w-max"
                    >
                        {categories.map((categoryName, idx) => (
                            <li
                                role="menuitem"
                                aria-selected={active === idx}
                                tabIndex={idx}
                                onClick={() => {
                                    setActive(idx);
                                    setCategorySelect(categoryName);
                                    setShowCategories(false);
                                }}
                                key={idx}
                                className="text-center text-white hover:bg-zinc-700 focus:bg-zinc-700 rounded-sm cursor-pointer"
                            >
                                {active === idx ? (
                                    <span className="flex justify-start w-full items-center gap-2 px-[2px]">
                                        <IoCheckmarkDoneOutline />{' '}
                                        {categoryName}
                                    </span>
                                ) : (
                                    categoryName
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
