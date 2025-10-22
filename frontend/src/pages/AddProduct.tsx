import ButtonLink from '../components/ui/ButtonLink';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import itemApi from '../api/itemApi';
import { useCategories } from '../hooks/useCategories';
import { useItems } from '../hooks/useItems';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaBoxOpen, FaHashtag, FaDollarSign, FaSave } from 'react-icons/fa';
import { LuLetterText } from 'react-icons/lu';
import { IoPricetagsOutline } from 'react-icons/io5';
import { type Item } from '../types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

const productSchema = z.object({
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

type ProductData = z.infer<typeof productSchema>;

export default function AddProduct() {
    const { categoryNamesMap, categoryList } = useCategories();
    const { setItems } = useItems();
    const {
        watch,
        handleSubmit,
        register,
        formState: { isLoading, errors },
    } = useForm<ProductData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            category: '',
            description: '',
            quantity: 0,
            price: 0,
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data: ProductData) => {
        try {
            const newItem = {
                name: data.name,
                category_id: categoryNamesMap[watch('category')] as string,
                current_quantity: data.quantity,
                price_cents: data.price * 100,
                description: data.description,
            };

            const itemCreated: Item = await itemApi.createItem(newItem);
            setItems((prev) => [itemCreated, ...prev]);
            toast.success('Produto criado com sucesso!', {
                position: 'bottom-right',
                richColors: true,
            });
            navigate(`/products/${itemCreated.item_id}`);
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
                <div>
                    <ButtonLink
                        className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer hover:bg-stone-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                        to="/products"
                        text="Voltar"
                        icon={<FaArrowLeft />}
                    />
                </div>
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Novo Produto
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Adicione um novo produto ao seu inventário
                    </p>
                </div>
            </header>
            <div>
                <div className="space-y-4 p-4 ring ring-gray-700/40 w-full max-w-140 rounded-md">
                    <h2 className="flex items-center gap-2 text-xl text-indigo-500">
                        {' '}
                        <FaBoxOpen /> <span>Informações do Produto</span>
                    </h2>
                    <form
                        className="flex flex-col gap-2 w-full "
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-2 p-[5px]">
                            <label
                                htmlFor="nameItem"
                                className={`${
                                    errors.name ? 'text-red-400' : 'text-white'
                                } flex items-center gap-2  text-sm`}
                            >
                                <FaBoxOpen /> <span>Nome do Produto</span>
                            </label>

                            <input
                                type="text"
                                id="nameItem"
                                className={`block p-3 w-full text-sm text-white bg-stone-900  
                                rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                ${
                                    errors.name
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                }`}
                                {...register('name')}
                                placeholder="Ex: MacBook Pro M3"
                                required
                            />

                            <div className="flex flex-col gap-2">
                                {errors.name ? (
                                    <span className="text-xs text-red-400">
                                        {errors.name.message}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Digite o nome completo do produto
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 p-[5px]">
                            <div className="space-y-2 w-1/2">
                                <label
                                    htmlFor="quantity"
                                    className={`${
                                        errors.quantity
                                            ? 'text-red-400'
                                            : 'text-white'
                                    } flex items-center gap-2  text-sm`}
                                >
                                    <FaHashtag />
                                    <span> Quantidade</span>
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    className={`block p-3 w-full text-sm text-white bg-stone-900
                                    rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                    ${
                                        errors.quantity
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                    }`}
                                    {...register('quantity', {
                                        valueAsNumber: true,
                                    })}
                                    placeholder="0"
                                    required
                                />

                                <div className="flex flex-col gap-2">
                                    {errors.quantity ? (
                                        <span className="text-xs text-red-400">
                                            {errors.quantity.message}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            Quantidade disponível em estoque
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 w-1/2">
                                <label
                                    htmlFor="price"
                                    className={`${
                                        errors.price
                                            ? 'text-red-400'
                                            : 'text-white'
                                    } flex items-center gap-2  text-sm`}
                                >
                                    <FaDollarSign />
                                    <span> Preço (R$)</span>
                                </label>

                                <input
                                    type="number"
                                    id="price"
                                    className={`block p-3 w-full text-sm text-white bg-stone-900
                                    rounded-lg appearance-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                    ${
                                        errors.price
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                    }`}
                                    {...register('price', {
                                        valueAsNumber: true,
                                    })}
                                    placeholder="0"
                                    required
                                />
                                <div className="flex flex-col gap-2">
                                    {errors.price ? (
                                        <span className="text-xs text-red-400">
                                            {errors.price.message}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            Preço do produto
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-[5px]">
                            <label
                                htmlFor="category-options"
                                className={`${
                                    errors.category
                                        ? 'text-red-400'
                                        : 'text-white'
                                } flex items-center gap-2  text-sm`}
                            >
                                <IoPricetagsOutline /> <span>Categoria</span>
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
                                <option selected disabled value="">
                                    Selecione uma categoria
                                </option>

                                {categoryList.slice(2).map((category, idx) => (
                                    <option key={idx} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-col gap-2">
                                {errors.category ? (
                                    <span className="text-xs text-red-400">
                                        {errors.category.message}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Selecione a categoria do produto
                                    </span>
                                )}
                                <span className="text-gray-400 text-[11.5px]">
                                    Não encontrou uma categoria?{' '}
                                    <Link
                                        className="text-white hover:text-gray-300 duration-300"
                                        to={'/categories'}
                                    >
                                        Crie uma!
                                    </Link>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-[5px]">
                            <label
                                htmlFor="description"
                                className={`${
                                    errors.description
                                        ? 'text-red-400'
                                        : 'text-white'
                                } flex items-center gap-2  text-sm`}
                            >
                                <LuLetterText />
                                <span>Descrição</span>
                            </label>

                            <div className="relative">
                                <textarea
                                    id="description"
                                    rows={5}
                                    style={{
                                        scrollbarWidth: 'none',
                                    }}
                                    className={`block py-3 p-5 w-full text-sm text-white bg-stone-900
                                    rounded-lg appearance-none resize-none focus:outline-none focus:ring-2 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                    ${
                                        errors.description
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                    }`}
                                    {...register('description')}
                                    placeholder="Descreva as características do produto"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex flex-col gap-2">
                                {errors.description ? (
                                    <span className="text-xs text-red-400">
                                        {errors.description.message}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Adicione uma descrição detalhada do
                                        produto
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
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />{' '}
                                        <span>Adicionar Produto</span>
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
