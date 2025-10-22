import ButtonLink from '../components/ui/ButtonLink';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import categoryApi from '../api/categoryApi';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { FaSave } from 'react-icons/fa';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa6';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Category } from '../types';
import { toast } from 'sonner';

const editCategorySchema = z.object({
    name: z.string().nonempty('Categoria é obrigatória'),
});

type EditCategoryData = z.infer<typeof editCategorySchema>;

export default function EditCategory() {
    const { category_id, name: categoryName } = useLoaderData<Category>();
    const { categories, setCategories } = useCategories();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
    } = useForm<EditCategoryData>({
        resolver: zodResolver(editCategorySchema),
        defaultValues: { name: categoryName },
    });

    const onSubmit = async (data: EditCategoryData) => {
        try {
            const updatedCategory: Category = await categoryApi.updateCategory(
                { name: data.name },
                category_id!
            );

            const updatedCategories = categories.map((category) =>
                category.category_id === category_id
                    ? updatedCategory
                    : category
            );
            toast.success('Categoria atualizada com sucesso!', {
                position: 'bottom-right',
                richColors: true,
            });

            setCategories(updatedCategories);
            navigate(`/categories`);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response.data.message, {
                position: 'top-center',
                richColors: true,
            });
        }
    };

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 py-4 px-2 sm:flex-row sm:items-center">
                <ButtonLink
                    className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md hover:bg-stone-900 transition-colors"
                    to="/categories"
                    text="Voltar"
                    icon={<FaArrowLeft />}
                />
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Editar Categoria
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Atualizar informações da categoria
                    </p>
                </div>
            </header>

            <div className="space-y-4 p-4 ring ring-gray-700/40 w-full max-w-140 rounded-md">
                <h2 className="flex items-center gap-2 text-xl text-indigo-500">
                    <IoPricetagsOutline /> <span>Categoria</span>
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 w-full"
                >
                    <div className="flex flex-col gap-2 p-[5px]">
                        <label
                            htmlFor="nameItem"
                            className={`${
                                errors.name ? 'text-red-400' : 'text-white'
                            } flex items-center gap-2 text-sm`}
                        >
                            Nome
                        </label>

                        <input
                            id="nameItem"
                            type="text"
                            placeholder="Nome da categoria"
                            className={`block p-3 w-full text-sm text-white bg-stone-900 rounded-lg focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0,90)]
                ${
                    errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-violet-500'
                }`}
                            {...register('name')}
                            required
                        />

                        {errors.name && (
                            <span className="text-xs text-red-400">
                                {errors.name.message}
                            </span>
                        )}
                        {!errors.name && (
                            <span className="text-xs text-gray-400">
                                Digite o nome completo da categoria
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative self-end bg-gradient-to-r from-sky-500 to-sky-800 text-white font-bold py-3 px-8 rounded-xl cursor-pointer transform transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/30 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-stone-950 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none group overflow-hidden mt-2"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FaSave /> <span>Atualizar Categoria</span>
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </section>
    );
}
