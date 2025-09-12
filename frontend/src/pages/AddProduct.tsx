import ButtonLink from '../components/ui/ButtonLink';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import itemApi from '../api/itemApi';
import { useCategories } from '../hooks/useCategories';
import { useItems } from '../hooks/useItems';
import { useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaBoxOpen, FaHashtag, FaDollarSign, FaSave } from 'react-icons/fa';
import { LuLetterText } from 'react-icons/lu';
import { IoPricetagsOutline } from 'react-icons/io5';
import type { Item, ErrorResponse } from '../types';

export default function AddProduct() {
    const [nameItem, setNameItem] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [error, setError] = useState<ErrorResponse>({ code: '',message: [], });
    const [price, setPrice] = useState<string>('');
    const [categoryName, setCategoryName] =
        useState<string>('Select a category');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [limitDescription, setLimitDescription] = useState<number>(500);
    const { categoryInfo, categories } = useCategories();
    const { setItems } = useItems();

    const findError = (field: string): boolean => {
        return error.message.some((object) => object.field === field);
    };

    const clearFieldError = (field: string): void => {
        if (error.message.length > 0) {
            setError((prev) => ({
                ...prev,
                message: prev.message.filter((err) => err.field !== field),
            }));
        }
        return;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!nameItem || !quantity || !price || !categoryName || !description)
            return;

        setIsLoading(true);

        try {
            const newItem = {
                name: nameItem,
                category_id: categoryInfo[categoryName] as string,
                current_quantity: +quantity,
                price_cents: +price * 100,
                description,
            };

            const itemCreated: Item = await itemApi.createItem(newItem);
            setItems((prev) => [itemCreated, ...prev]);
            navigate(`/products/${itemCreated.item_id}`);
        } catch (error: any) {
            setError({
                code: error.response.data.code,
                message: error.response.data.details,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 py-4 px-2 sm:flex-row sm:items-center">
                <div>
                    <ButtonLink
                        className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer hover:bg-stone-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                        to="/products"
                        text="Back"
                        icon={<FaArrowLeft />}
                    />
                </div>
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        New Product
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Add a new product to your inventory
                    </p>
                </div>
            </header>
            <div>
                <div className="space-y-4 p-4 ring ring-gray-700/40 w-full max-w-140 rounded-md">
                    <h2 className="flex items-center gap-2 text-xl text-indigo-500">
                        {' '}
                        <FaBoxOpen /> <span>Product Information</span>
                    </h2>
                    <form
                        className="flex flex-col gap-2 w-full "
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2 p-[5px]">
                            <label
                                htmlFor="nameItem"
                                className={`${
                                    findError('name')
                                        ? 'text-red-400'
                                        : 'text-white'
                                } flex items-center gap-2  text-sm`}
                            >
                                <FaBoxOpen /> <span>Product Name</span>
                            </label>

                            <input
                                type="text"
                                id="nameItem"
                                value={nameItem}
                                className={`block p-3 w-full text-sm text-white bg-stone-900  
                                    rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                    ${
                                        findError('name')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                    }`}
                                onChange={(e) => {
                                    setNameItem(e.target.value);
                                    clearFieldError('name');
                                }}
                                placeholder="Ex: MacBook Pro M3"
                                required
                            />

                            <div className="flex flex-col gap-2">
                                {findError('name') ? (
                                    <span className="text-xs text-red-400">
                                        {
                                            error.message.find(
                                                ({ field }) => field === 'name'
                                            )?.message
                                        }
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Enter the full name of the product
                                    </span>
                                )}

                                {isSubmitted && !nameItem && (
                                    <span className="text-red-400 text-xs mt-1 block">
                                        Product Name is required
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 p-[5px]">
                            <div className="space-y-2 w-1/2">
                                <label
                                    htmlFor="quantity"
                                    className={`${
                                        findError('current_quantity')
                                            ? 'text-red-400'
                                            : 'text-white'
                                    } flex items-center gap-2  text-sm`}
                                >
                                    <FaHashtag />
                                    <span> Quantity</span>
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    className={`block p-3 w-full text-sm text-white bg-stone-900
                                        rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                        ${
                                            findError('current_quantity')
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                        }`}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                        clearFieldError('current_quantity');
                                    }}
                                    placeholder="0"
                                    required
                                />

                                <div className="flex flex-col gap-2">
                                    {findError('current_quantity') ? (
                                        <span className="text-xs text-red-400">
                                            {
                                                error.message.find(
                                                    ({ field }) =>
                                                        field ===
                                                        'current_quantity'
                                                )?.message
                                            }
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            Quantity available in stock
                                        </span>
                                    )}
                                    {isSubmitted && !quantity && (
                                        <span className="text-red-400 text-xs mt-1 block">
                                            Quantiy is required
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 w-1/2">
                                <label
                                    htmlFor="price"
                                    className={`${
                                        findError('price_cents')
                                            ? 'text-red-400'
                                            : 'text-white'
                                    } flex items-center gap-2  text-sm`}
                                >
                                    <FaDollarSign />
                                    <span> Price (R$)</span>
                                </label>

                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    className={`block p-3 w-full text-sm text-white bg-stone-900
                                        rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                        ${
                                            findError('price_cents')
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                        }`}
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                        clearFieldError('price_cents');
                                    }}
                                    placeholder="0"
                                    required
                                />
                                <div className="flex flex-col gap-2">
                                    {findError('price_cents') ? (
                                        <span className="text-xs text-red-400">
                                            {
                                                error.message.find(
                                                    ({ field }) =>
                                                        field === 'price_cents'
                                                )?.message
                                            }
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            price of the product
                                        </span>
                                    )}
                                    {isSubmitted && !price && (
                                        <span className="text-red-400 text-xs mt-1 block">
                                            Price is required
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-[5px]">
                            <label
                                htmlFor="category-options"
                                className="flex items-center gap-2 text-white text-sm"
                            >
                                <IoPricetagsOutline /> <span>Category</span>
                            </label>
                            <select
                                id="category-options"
                                onChange={(e) =>
                                    setCategoryName(e.target.value)
                                }
                                className="block p-3 w-full text-sm text-white bg-stone-900  
                                    rounded-lg focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]"
                                required
                            >
                                <option selected disabled value="">
                                    Select a category
                                </option>

                                {categories.slice(2).map((category, idx) => (
                                    <option key={idx} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-gray-400">
                                    Select product category
                                </span>
                                <span className="text-gray-400 text-[11.5px]">
                                    Didn't find a category? Create one!
                                </span>
                                {isSubmitted && !categoryName && (
                                    <span className="text-red-400 text-xs mt-1 block">
                                        Category is required
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-[5px]">
                            <label
                                htmlFor="description"
                                className={`${
                                    error.message.some(
                                        ({ field }) => field === 'description'
                                    )
                                        ? 'text-red-400'
                                        : 'text-white'
                                } flex items-center gap-2  text-sm`}
                            >
                                <LuLetterText /> <span>Description</span>
                            </label>

                            <div className="relative">
                                <textarea
                                    id="description"
                                    value={description}
                                    rows={5}
                                    style={{
                                        scrollbarWidth: 'none',
                                    }}
                                    className={`block py-3 p-5 w-full text-sm text-white bg-stone-900
                                        rounded-lg appearance-none resize-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                        ${
                                            findError('description')
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                        }`}
                                    onChange={(e) => {
                                        let value: string = e.target.value;

                                        if (value.length > 500) {
                                            value = value.slice(0, 500);
                                        }

                                        setDescription(value);
                                        clearFieldError('description');
                                        setLimitDescription(500 - value.length);
                                    }}
                                    placeholder="Describe the product features"
                                    required
                                ></textarea>
                                <span className="absolute bottom-0 right-2 text-xs text-gray-500">
                                    {limitDescription}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {findError('description') ? (
                                    <span className="text-xs text-red-400">
                                        {
                                            error.message.find(
                                                ({ field }) =>
                                                    field === 'description'
                                            )?.message
                                        }
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Add a detailed product description
                                    </span>
                                )}
                                {isSubmitted && !description && (
                                    <span className="text-red-400 text-xs mt-1 block">
                                        Description is required
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative self-end bg-gradient-to-r from-sky-500 to-sky-800 
                                text-white font-bold py-3 px-8 rounded-xl cursor-pointer 
                                transform transition-all duration-300 ease-out
                                hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/30
                                active:scale-[0.99]
                                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-stone-950 
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                                group overflow-hidden mt-2"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave /> <span>Add Product</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
