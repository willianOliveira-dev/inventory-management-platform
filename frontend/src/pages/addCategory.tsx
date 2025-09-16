import ButtonLink from '../components/ui/ButtonLink';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import categoryApi from '../api/categoryApi';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { FaSave } from 'react-icons/fa';
import { useState, type FormEvent } from 'react';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa6';
import { type Category } from '../types';

export default function AddCategory() {
    const [name, setName] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setCategories } = useCategories();
    const [error, setError] = useState<{ code: string;  message: { field: string; message: string; code: string }[] | string; }>({  code: '', message: '',});

    const findError = (type: 'code' | 'message', field: string): boolean => {
        if (type === 'code') return error.code === field;
        return (
            Array.isArray(error.message) &&
            error.message.some((object) => object.field === field)
        );
    };

    const getErrorMessage = (field: string): string => {
        if (
            error.code === 'CATEGORY_ALREADY_EXISTS' &&
            !Array.isArray(error.message)
        ) {
            return error.message;
        }

        if (Array.isArray(error.message)) {
            const fieldError = error.message.find((err) => err.field === field);
            console.log(fieldError);
            return fieldError?.message || '';
        }

        return '';
    };

    const clearFieldError = (field: string): void => {
        if (Array.isArray(error.message) && error.message.length > 0) {
            const filteredMessage = error.message.filter(
                (err) => err.field !== field
            );
            setError((prev) => ({
                ...prev,
                message: filteredMessage,
            }));
        }
        if (error.code === 'CATEGORY_ALREADY_EXISTS') {
            setError((prev) => ({ ...prev, code: '' }));
        }
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setError({ code: '', message: [] });

        if (!name) return;
        setIsLoading(true);

        try {
            const newCategory: Category = await categoryApi.createCategory({
                name,
            });
            setCategories((prev) => [newCategory, ...prev]);
            navigate('/categories');
        } catch (error: any) {
            if (error.response?.data?.code === 'CATEGORY_ALREADY_EXISTS') {
                setError({
                    code: 'CATEGORY_ALREADY_EXISTS',
                    message: error.response?.data?.message,
                });
            } else if (error.response?.data?.details) {
                setError({
                    code: error.response?.data?.code,
                    message: error.response?.data?.details,
                });
            } else {
                setError({
                    code: error.response?.data?.code || 'UNKNOWN_ERROR',
                    message: [],
                });
            }
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
                        to="/categories"
                        text="Back"
                        icon={<FaArrowLeft />}
                    />
                </div>
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Add Category
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Add a new category to your inventory
                    </p>
                </div>
            </header>
            <div className="space-y-4 p-4 ring ring-gray-700/40 w-full max-w-140 rounded-md">
                <h2 className="flex items-center gap-2 text-xl text-indigo-500">
                    {' '}
                    <IoPricetagsOutline /> <span>New Category</span>
                </h2>
                <form
                    className="flex flex-col gap-2 w-full "
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-2 p-[5px]">
                        <label
                            htmlFor="nameItem"
                            className={`${
                                error.code === 'CATEGORY_ALREADY_EXISTS' ||
                                findError('message', 'name')
                                    ? 'text-red-400'
                                    : 'text-white'
                            } flex items-center gap-2  text-sm`}
                        >
                            <span>Name</span>
                        </label>

                        <input
                            type="text"
                            id="nameItem"
                            value={name}
                            className={`block p-3 w-full text-sm text-white bg-stone-900  
                                                rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                                ${
                                                    error.code ===
                                                        'CATEGORY_ALREADY_EXISTS' ||
                                                    findError('message', 'name')
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                                }`}
                            onChange={(e) => {
                                setName(e.target.value);
                                clearFieldError('name');
                            }}
                            placeholder="Category name"
                            required
                        />

                        <div className="flex flex-col gap-2">
                            {getErrorMessage('name') && (
                                <span className="text-xs text-red-400">
                                    {getErrorMessage('name')}
                                </span>
                            )}

                            {!getErrorMessage('name') && (
                                <span className="text-xs text-gray-400">
                                    Enter the full name of the category
                                </span>
                            )}

                            {isSubmitted && !name && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    Category is required
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
                                    <FaSave /> <span>Create Category</span>
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </section>
    );
}
