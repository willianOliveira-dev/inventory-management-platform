import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonLink from '../components/ui/ButtonLink';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import categoryApi from '../api/categoryApi';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { FaSave } from 'react-icons/fa';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa6';
import { type Category } from '../types';
import { useForm } from 'react-hook-form';

const categorySchema = z.object({
    name: z
        .string({ error: 'O nome deve ser um texto.' })
        .nonempty({ error: 'O nome não pode ficar em branco.' })
        .min(3, {
            error: 'O nome da categoria deve ter no mínimo 3 caracteres.',
        })
        .max(120, {
            error: 'O nome da categoria deve ter no máximo 120 caracteres.',
        })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+$/, {
            message: 'Apenas letras, números e espaços são permitidos.',
        })
        .transform((str) => str.trim()),
});

type CategoryData = z.infer<typeof categorySchema>;

export default function AddCategory() {
    const { setCategories } = useCategories();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { isLoading, errors },
    } = useForm<CategoryData>({
        resolver: zodResolver(categorySchema),
    });

    const onSubmit = async (data: CategoryData) => {
        try {
            const newCategory: Category = await categoryApi.createCategory(
                data
            );
            setCategories((prev) => [newCategory, ...prev]);
            toast.success('Categoria criada com sucesso!', {
                position: 'bottom-right',
                richColors: true,
            });
            navigate('/categories');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response.data.message, {
                position: 'top-center',
                richColors: true,
            });
        }
    };

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <header className="flex flex-col gap-4 py-4 px-2 sm:flex-row sm:items-center">
                <div>
                    <ButtonLink
                        className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer hover:bg-stone-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                        to="/categories"
                        text="Voltar"
                        icon={<FaArrowLeft />}
                    />
                </div>
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Adicionar Categoria
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Adicione uma nova categoria ao seu inventário
                    </p>
                </div>
            </header>
            <div className="space-y-4 p-4 ring ring-gray-700/40 w-full max-w-140 rounded-md">
                <h2 className="flex items-center gap-2 text-xl text-indigo-500">
                    <IoPricetagsOutline /> <span>Nova Categoria</span>
                </h2>
                <form
                    className="flex flex-col gap-2 w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col gap-2 p-[5px]">
                        <label
                            htmlFor="nameItem"
                            className={`${
                                errors.name ? 'text-red-400' : 'text-white'
                            } flex items-center gap-2 text-sm`}
                        >
                            <span>Nome</span>
                        </label>

                        <input
                            type="text"
                            id="nameItem"
                            {...register('name')}
                            className={`block p-3 w-full text-sm text-white bg-stone-900
                            rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                            ${
                                errors.name
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500'
                            }`}
                            placeholder="Nome da categoria"
                            required
                        />
                        {errors.name && (
                            <span className="text-xs text-red-400 mt-1 block">
                                {errors.name.message}
                            </span>
                        )}
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
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FaSave /> <span>Criar Categoria</span>
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </section>
    );
}
