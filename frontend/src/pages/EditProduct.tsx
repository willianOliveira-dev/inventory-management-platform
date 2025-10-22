import ButtonLink from '../components/ui/ButtonLink';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import itemApi from '../api/itemApi';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useItems } from '../hooks/useItems';
import {
    FaArrowLeft,
    FaBoxOpen,
    FaHashtag,
    FaDollarSign,
    FaSave,
} from 'react-icons/fa';
import { LuLetterText } from 'react-icons/lu';
import { IoPricetagsOutline } from 'react-icons/io5';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Item } from '../types';
import { toast } from 'sonner';

const editProductSchema = z.object({
    name: z
        .string({ error: 'O nome deve ser um texto.' })
        .nonempty({ error: 'O nome não pode ficar em branco.' })
        .min(3, { error: 'O nome do item deve ter no mínimo 3 caracteres.' })
        .max(120, {
            error: 'O nome do item deve ter no máximo 120 caracteres.',
        })
        .transform((str) => str.trim()),

    category: z
        .string({ error: 'A categoria deve ser um texto.' })
        .nonempty({ error: 'A categoria é obrigatória. Selecione uma opção.' }),

    description: z
        .string({ error: 'A descrição deve ser um texto.' })
        .nonempty({ error: 'A descrição não pode ficar em branco.' })
        .min(50, { error: 'A descrição deve ter no mínimo 50 caracteres.' })
        .max(500, { error: 'A descrição deve ter no máximo 500 caracteres.' })
        .transform((str) => str.trim()),

    price: z
        .number({ error: 'O valor deve ser um número.' })
        .int({
            error: 'Somente valores inteiros são permitidos. Exemplo: R$ 1,00 = 100 centavos.',
        })
        .positive({ error: 'O valor deve ser positivo.' })
        .min(1, { error: 'O valor mínimo é R$ 1,00' }),

    quantity: z
        .number({ error: 'A quantidade deve ser um número.' })
        .int({ error: 'A quantidade deve ser um número inteiro.' })
        .min(0, { error: 'Não é permitido ter saldo negativo em estoque.' }),
});

type EditProductData = z.infer<typeof editProductSchema>;

export default function EditProduct() {
    const { categoryNamesMap, categoryList, categoryIdsMap } = useCategories();
    const { items, setItems } = useItems();
    const {
        item_id,
        name,
        category_id,
        current_quantity,
        price_cents,
        description,
    } = useLoaderData<Item>();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
    } = useForm<EditProductData>({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            name,
            quantity: current_quantity,
            price: price_cents / 100,
            category: categoryIdsMap[category_id],
            description,
        },
    });

    const onSubmit = async (data: EditProductData) => {
        try {
            const updatedItem = await itemApi.updateItem(
                {
                    name: data.name,
                    category_id: categoryNamesMap[data.category] as string,
                    current_quantity: data.quantity,
                    price_cents: data.price * 100,
                    description: data.description,
                },
                item_id!
            );

            const updatedItems = items.map((item) =>
                item.item_id === item_id ? updatedItem : item
            );
            toast.success('Produto atualizado com sucesso!', {
                position: 'bottom-right',
                richColors: true,
            });
            setItems(updatedItems);
            navigate(`/products/${updatedItem.item_id}`);
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
                    to="/products"
                    text="Voltar"
                    icon={<FaArrowLeft />}
                />
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Editar Produto
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Atualizar informações do produto
                    </p>
                </div>
            </header>

            <div className="space-y-4 p-4 ring ring-gray-700/40 w-full max-w-140 rounded-md">
                <h2 className="flex items-center gap-2 text-xl text-indigo-500">
                    <FaBoxOpen /> <span>Informações do Produto</span>
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2 w-full"
                >
                    <div className="flex flex-col gap-2 p-[5px]">
                        <label
                            htmlFor="nameItem"
                            className={`flex items-center gap-2 text-sm ${
                                errors.name ? 'text-red-400' : 'text-white'
                            }`}
                        >
                            <FaBoxOpen /> Nome do Produto
                        </label>
                        <input
                            id="nameItem"
                            type="text"
                            placeholder="Ex: MacBook Pro M3"
                            className={`block p-3 w-full text-sm text-white bg-stone-900 rounded-lg focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0,90)] ${
                                errors.name
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:ring-violet-500'
                            }`}
                            {...register('name')}
                        />
                        {errors.name && (
                            <span className="text-xs text-red-400">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2 p-[5px]">
                        <div className="space-y-2 w-1/2">
                            <label
                                htmlFor="quantity"
                                className={`flex items-center gap-2 text-sm ${
                                    errors.quantity
                                        ? 'text-red-400'
                                        : 'text-white'
                                }`}
                            >
                                <FaHashtag /> Quantidade
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                {...register('quantity', {
                                    valueAsNumber: true,
                                })}
                                placeholder="0"
                                className={`block p-3 w-full text-sm text-white bg-stone-900 rounded-lg focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0,90)] ${
                                    errors.quantity
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:ring-violet-500'
                                }`}
                            />
                            {errors.quantity && (
                                <span className="text-xs text-red-400">
                                    {errors.quantity.message}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 w-1/2">
                            <label
                                htmlFor="price"
                                className={`flex items-center gap-2 text-sm ${
                                    errors.quantity
                                        ? 'text-red-400'
                                        : 'text-white'
                                }`}
                            >
                                <FaDollarSign /> Preço (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="price"
                                {...register('price', {
                                    valueAsNumber: true,
                                })}
                                placeholder="0"
                                className={`block p-3 w-full text-sm text-white bg-stone-900 rounded-lg focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0,90)] ${
                                    errors.price
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:ring-violet-500'
                                }`}
                            />
                            {errors.price && (
                                <span className="text-xs text-red-400 block">
                                    {errors.price.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 p-[5px]">
                        <label
                            htmlFor="category-options"
                            className="flex items-center gap-2 text-white text-sm"
                        >
                            <IoPricetagsOutline /> Categoria
                        </label>
                        <select
                            id="category-options"
                            {...register('category')}
                            className={`block p-3 w-full text-sm text-white bg-stone-900  
                                rounded-lg focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]   ${
                                    errors.category
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                }`}
                            required
                        >
                            <option disabled value="">
                                Selecione uma categoria
                            </option>

                            {categoryList.map((category, idx) => (
                                <option key={idx} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {errors.category && (
                            <span className="text-xs text-red-400 block">
                                {errors.category.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 p-[5px]">
                        <label
                            htmlFor="description"
                            className={`flex items-center gap-2 text-sm ${
                                errors.description
                                    ? 'text-red-400'
                                    : 'text-white'
                            }`}
                        >
                            <LuLetterText /> Descrição
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            {...register('description')}
                            className={`block py-3 p-5 w-full text-sm text-white bg-stone-900 rounded-lg resize-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0,90)] ${
                                errors.description
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:ring-violet-500'
                            }`}
                            placeholder="Descreva as características do produto"
                        />
                        {errors.description && (
                            <span className="text-xs text-red-400 block">
                                {errors.description.message}
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
                                    Atualizando...
                                </>
                            ) : (
                                <>
                                    <FaSave /> Atualizar Produto
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </section>
    );
}
