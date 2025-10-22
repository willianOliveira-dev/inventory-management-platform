import ButtonLink from '../components/ui/ButtonLink';
import ReportCardView from '../components/ui/ReportCardView';
import CardAnalysis from '../components/ui/CardAnalysis';
import { useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';
import { FaDollarSign } from 'react-icons/fa6';
import { useItems } from '../hooks/useItems';
import { FaArrowLeft } from 'react-icons/fa6';
import { HiDocumentChartBar } from 'react-icons/hi2';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { FiAlertTriangle } from 'react-icons/fi';
import formatPrice from '../utils/formatPrice';
import { FaBoxOpen } from 'react-icons/fa';
import { FaChartBar } from 'react-icons/fa';


export default function Reports() {
    const { categoryList, categories, categoryNamesMap, categoryIdsMap } =
        useCategories();
    const { items } = useItems();
    const quantityLimit = 10;

    const productReference: { categoryName: string; productCount: number }[] =
        useMemo(() => {
            const record: Record<string, number> = {};

            categoryList.slice(2).forEach((category) => {
                record[category] = 0;
            });

            items.forEach(({ category_id }) => {
                const categoryName = categoryIdsMap[category_id];
                if (categoryName) {
                    record[categoryName] = (record[categoryName] || 0) + 1;
                }
            });

            return Object.entries(record).map(
                ([categoryName, productCount]) => ({
                    categoryName,
                    productCount,
                })
            );
        }, [items, categoryList, categoryIdsMap, categories]);

    const totalItems = useMemo(() => {
        return items.reduce(
            (prev, currentValue) => prev + currentValue.current_quantity,
            0
        );
    }, [items]);

    const totalStockValue = useMemo(
        () =>
            items.reduce(
                (prev, currentValue) =>
                    prev +
                    currentValue.price_cents * currentValue.current_quantity,
                0
            ),
        [items]
    );

    const lowStock = useMemo(() => {
        return items.filter(
            ({ current_quantity }) => current_quantity < quantityLimit
        ).length;
    }, [items]);

    const totalValueByCategory = (category: string) => {
        const itemsFilterByCategory = items.filter(
            (item) => item.category_id === categoryNamesMap[category]
        );

        const totalValue = itemsFilterByCategory.reduce(
            (prev, currentValue) =>
                prev + currentValue.price_cents * currentValue.current_quantity,
            0
        );

        return totalValue;
    };

    const totalPercentageInStock = (totalValueByCategory: number) => {
        const formatPrice = new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            maximumFractionDigits: 2,
        });
        return formatPrice.format(
            (totalValueByCategory / 100 / totalStockValue) * 100
        );
    };

    return (
    <section className="flex flex-col gap-6 p-4 md:p-6">
        <header className="flex flex-col justify-center gap-4 py-4 px-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                    <ButtonLink
                        className="flex gap-2 items-center text-white p-2 md:p-3 rounded-md cursor-pointer hover:bg-stone-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                        to="/"
                        text="Voltar"
                        icon={<FaArrowLeft />}
                    />
                </div>
                <div className="space-y-1">
                    <h1 className="text-indigo-500 text-4xl lg:text-5xl font-bold tracking-tighter">
                        Relatórios
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Análise completa do seu inventário e desempenho
                    </p>
                </div>
            </div>
        </header>
        {/* Cards de resumo */}
        <div className="grid grid-cols-4 gap-4 w-full max-lg:grid-cols-2 max-sm:grid-cols-1">
            <ReportCardView
                label="Valor Total do Estoque"
                data={formatPrice(totalStockValue)}
                description="Valor total investido"
                icon={
                    <FaDollarSign className="size-full p-[5px] bg-green-600 rounded-full" />
                }
            />

            <ReportCardView
                label="Produtos Únicos"
                data={String(items.length)}
                description="Tipos diferentes de produtos"
                icon={
                    <FaBoxOpen className="size-full p-[5px] bg-purple-500 rounded-full" />
                }
            />
            <ReportCardView
                label="Total de Itens"
                data={String(totalItems)}
                description="Total de dados em estoque"
                icon={
                    <LuChartNoAxesCombined className="size-full p-[5px] bg-green-400 rounded-full" />
                }
            />

            <ReportCardView
                label="Estoque Baixo"
                data={String(lowStock)}
                description="Produtos com menos de 10 unidades"
                icon={
                    <FiAlertTriangle className="size-full p-[5px] bg-red-400 rounded-full" />
                }
            />
        </div>
        {/*Seção de Análise*/}
        <div className="space-y-2 max-h-120 overflow-y-auto mt-4 py-4 px-2 bg-stone-900 rounded-md">
            <h2 className="flex items-center px-4 gap-2 text-white text-2xl font-bold tracking-tighter">
                <FaChartBar />
                <span>Análise por categoria</span>
            </h2>
            <div className="space-y-2 p-2">
                {productReference.map(
                    ({ categoryName, productCount }, idx) => (
                        <CardAnalysis
                            key={idx}
                            category={categoryName}
                            productCount={productCount}
                            totalValueByCategory={formatPrice(
                                totalValueByCategory(categoryName)
                            )}
                            totalPercentageInStock={totalPercentageInStock(
                                totalValueByCategory(categoryName)
                            )}
                        />
                    )
                )}
            </div>
        </div>
        <div className="space-y-2 max-h-120 overflow-y-auto mt-4 py-4 px-2 bg-stone-900 rounded-md text-white">
            <h2 className="flex items-center px-4 gap-2 text-white text-2xl font-bold tracking-tighter">
                <HiDocumentChartBar />
                <span>Resumo Executivo</span>
            </h2>
            <div className="flex justify-between gap-4 w-full p-4">
                <div className="w-1/2">
                    <h3 className="font-semibold mb-2">Status do estoque</h3>
                    <ul className="flex flex-col gap-[3.5px] text-gray-400">
                        <li className="text-xs">
                            • {items.length} tipos de produtos cadastrados.
                        </li>
                        <li className="text-xs">
                            • {totalItems} itens em estoque.
                        </li>
                        <li className="text-xs">
                            • {lowStock} produtos com estoque baixo.
                        </li>
                        <li className="text-xs">
                            • {formatPrice(totalStockValue)} em valor total investido.
                        </li>
                    </ul>
                </div>
                <div className="w-1/2">
                    <h3 className="font-semibold mb-2">Recomendações</h3>
                    <ul className="flex flex-col gap-[3.5px] text-gray-400">
                        <li className="text-xs"> 
                            {lowStock > 0 
                                ? `• Reabastecer ${lowStock} produtos com estoque baixo.`
                                : "• Todos os produtos têm estoque adequado."
                            }
                        </li>
                        <li className="text-xs">
                            • Monitorar regularmente os níveis de inventário.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);
}
