import ReportCardView from '../components/ui/ReportCardView';
import CardProduct from '../components/ui/CardProduct';
import ButtonLink from '../components/ui/ButtonLink';
import imageCollectingData from '../assets/collecting-data.webp';
import generateChartData from '../utils/generateChartData';
import { useMemo, useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useAuth } from '../hooks/useAuth';
import { BsBoxSeam } from 'react-icons/bs';
import { FaBoxOpen } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { FiAlertTriangle } from 'react-icons/fi';
import { useCategories } from '../hooks/useCategories';
import formatPrice from '../utils/formatPrice';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from 'recharts';


const LOW_STOCK_COLORS = ['#FF8042', '#00C49F'];

export default function Home() {
    const { user } = useAuth();
    const { items } = useItems();
    const { categories, setCategorySelect } = useCategories();
    const [timeRange, setTimeRange] = useState(10);
    const days = timeRange;
    const quantityLimit = 10;

    const [chartData, dayCount] = useMemo(
        () => generateChartData(items, days),
        [items, days]
    );

    const totalItems = useMemo(() => {
        return items.reduce(
            (prev, currentValue) => prev + currentValue.current_quantity,
            0
        );
    }, [items]);

    const lowStock = useMemo(() => {
        return items.filter(
            ({ current_quantity }) => current_quantity < quantityLimit
        ).length;
    }, [items]);

    // Função para obter o nome da categoria pelo ID
    const getCategoryNameById = (categoryId: string) => {
        const category = categories.find(
            (cat) => cat.category_id === categoryId
        );
        return category ? category.name : `Category ${categoryId}`;
    };

    // Dados para o gráfico de pizza (estoque normal vs baixo estoque)
    const stockPieData = useMemo(
        () => [
            { name: 'Normal Stock', value: items.length - lowStock },
            { name: 'Low Stock', value: lowStock },
        ],
        [items, lowStock]
    );

    // Dados para o gráfico de categorias (quantidade)
    const categoryData = useMemo(() => {
        const categoriesMap: { [categoryName: string]: number } = {};
        items.forEach((item) => {
            const categoryName = getCategoryNameById(item.category_id);
            if (!categoriesMap[categoryName]) {
                categoriesMap[categoryName] = 0;
            }
            categoriesMap[categoryName] += item.current_quantity;
        });

        return Object.entries(categoriesMap).map(([name, value]) => ({
            name,
            value,
        }));
    }, [items, categories]);

    // Dados para o gráfico de valor total por categoria
    const categoryValueData = useMemo(() => {
        const categoriesMap: { [categoryName: string]: number } = {};
        items.forEach((item) => {
            const categoryName = getCategoryNameById(item.category_id);
            if (!categoriesMap[categoryName]) {
                categoriesMap[categoryName] = 0;
            }
            categoriesMap[categoryName] +=
                item.price_cents * item.current_quantity;
        });

        return Object.entries(categoriesMap).map(([name, value]) => ({
            name,
            value: value / 100,
        }));
    }, [items, categories]);

    // Dados para o gráfico de distribuição de produtos por categoria
    const productsByCategoryData = useMemo(() => {
        const categoriesMap: { [categoryName: string]: number } = {};
        items.forEach((item) => {
            const categoryName = getCategoryNameById(item.category_id);
            if (!categoriesMap[categoryName]) {
                categoriesMap[categoryName] = 0;
            }
            categoriesMap[categoryName] += 1;
        });

        return Object.entries(categoriesMap).map(([name, value]) => ({
            name,
            products: value,
        }));
    }, [items, categories]);

    return (
        <section className="flex flex-col gap-6 p-6 animate-fadeIn">
            <div className="relative max-w-full bg-gradient-to-r from-purple-700 via-purple-600 to-violet-500 py-8 px-6 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/70 to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-40 h-40 -mt-10 -mr-10 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-30 h-30 -mb-10 -ml-10 bg-violet-300 opacity-20 rounded-full"></div>
                <img
                    className="absolute top-1/2 -translate-y-1/2 right-0 w-50 h-30 z-0 sm:w-64 sm:h-44 opacity-90"
                    src={imageCollectingData}
                    alt=""
                    loading="lazy"
                />
                <div className="space-y-3 z-10 relative">
                    <h2 className="font-[Vidaloka] text-3xl text-purple-100 tracking-wise">
                        Hello, <span className="text-white">{user?.name}!</span>
                    </h2>
                    <h1 className="text-white text-5xl font-bold tracking-tighter">
                        Dashboard
                    </h1>
                    <p className="text-purple-100 text-lg">
                        Welcome to your inventory management system
                    </p>
                </div>
            </div>

            {items.length > 0 && (
                <>
                    {/* Filtro de tempo */}
                    <div className="flex justify-end items-center gap-4 bg-stone-800 p-3 rounded-lg">
                        <span className="text-gray-300">Time Range:</span>
                        <select
                            value={timeRange}
                            onChange={(e) =>
                                setTimeRange(Number(e.target.value))
                            }
                            className="bg-stone-700 text-white px-3 py-1 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value={7}>Last 7 days</option>
                            <option value={10}>Last 10 days</option>
                            <option value={30}>Last 30 days</option>
                        </select>
                    </div>

                    {/* Cards de resumo */}
                    <div className="grid grid-cols-4 gap-4 w-full max-lg:grid-cols-2 max-sm:grid-cols-1">
                        <ReportCardView
                            label="Total Products"
                            data={items.length}
                            description="Different types of products"
                            icon={
                                <FaBoxOpen className="size-full p-[5px] bg-purple-500 rounded-full" />
                            }
                        />
                        <ReportCardView
                            label="Total Items"
                            data={totalItems}
                            description="Total data in stock"
                            icon={
                                <LuChartNoAxesCombined className="size-full  p-[5px] bg-green-400 rounded-full" />
                            }
                        />
                        <ReportCardView
                            label={`Added (${days} days)`}
                            data={dayCount}
                            description="Newly added products"
                            icon={
                                <IoCalendarNumberOutline className="size-full p-[5px] bg-blue-400 rounded-full" />
                            }
                        />
                        <ReportCardView
                            label="Low Stock"
                            data={lowStock}
                            description="Products with less than 10 units"
                            icon={
                                <FiAlertTriangle className="size-full p-[5px] bg-red-400 rounded-full" />
                            }
                        />
                    </div>

                    {/* Seção de Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gráfico de produtos adicionados por dia */}
                        <div className="bg-stone-900 p-6 rounded-xl shadow-md ring-1 ring-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <IoCalendarNumberOutline className="text-blue-400" />
                                Products Added (Last {days} Days)
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorCount"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#8884d8"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#8884d8"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#444"
                                        />
                                        <XAxis dataKey="day" stroke="#aaa" />
                                        <YAxis stroke="#aaa" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#2d3748',
                                                borderColor: '#4a5568',
                                                color: 'white',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#8884d8"
                                            fillOpacity={1}
                                            fill="url(#colorCount)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráfico de pizza - Estoque normal vs baixo estoque */}
                        <div className="bg-stone-900 p-6 rounded-xl shadow-md ring-1 ring-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <FiAlertTriangle className="text-red-400" />
                                Stock Status
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stockPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, value }) => {
                                                const total: number =
                                                    stockPieData.reduce(
                                                        (sum, item) =>
                                                            sum + item.value,
                                                        0
                                                    );
                                                const percentage: string = (
                                                    ((value as number) /
                                                        total) *
                                                    100
                                                ).toFixed(0);
                                                return `${name}: ${percentage}%`;
                                            }}
                                        >
                                            {stockPieData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        LOW_STOCK_COLORS[
                                                            index %
                                                                LOW_STOCK_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => {
                                                const total: number =
                                                    stockPieData.reduce(
                                                        (sum, item) =>
                                                            sum + item.value,
                                                        0
                                                    );
                                                const percentage: string = (
                                                    ((value as number) /
                                                        total) *
                                                    100
                                                ).toFixed(1);
                                                return [
                                                    `${value} (${percentage}%)`,
                                                    name,
                                                ];
                                            }}
                                            contentStyle={{
                                                backgroundColor: '#2d3748',
                                                borderColor: '#4a5568',
                                                color: 'white',
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráfico de barras - Quantidade por categoria */}
                        <div className="bg-stone-900 p-6 rounded-xl shadow-md ring-1 ring-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <LuChartNoAxesCombined className="text-green-400" />
                                Quantity by Category
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={categoryData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#444"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#aaa"
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis stroke="#aaa" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#2d3748',
                                                borderColor: '#4a5568',
                                                color: 'white',
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráfico de valor total por categoria */}
                        <div className="bg-stone-900 p-6 rounded-xl shadow-md ring-1 ring-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <FaBoxOpen className="text-purple-400" />
                                Total Value by Category
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={categoryValueData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#444"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#aaa"
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis stroke="#aaa" />
                                        <Tooltip
                                            formatter={(value) => [
                                                formatPrice(
                                                    (value as number) * 100
                                                ),
                                                'Total Value',
                                            ]}
                                            contentStyle={{
                                                backgroundColor: '#2d3748',
                                                borderColor: '#4a5568',
                                                color: 'white',
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#00C49F" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráfico de distribuição de produtos por categoria */}
                        <div className="bg-stone-900 p-6 rounded-xl shadow-md ring-1 ring-gray-700 lg:col-span-2">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <FaBoxOpen className="text-purple-400" />
                                Products Distribution by Category
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={productsByCategoryData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                        layout="vertical"
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#444"
                                        />
                                        <XAxis type="number" stroke="#aaa" />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            stroke="#aaa"
                                            width={100}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#2d3748',
                                                borderColor: '#4a5568',
                                                color: 'white',
                                            }}
                                        />
                                        <Bar
                                            dataKey="products"
                                            fill="#8884d8"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Seção de Produtos */}
            <div
                className={`flex gap-6 text-white w-full media-screen-851 ${
                    items.length === 0 &&
                    'justify-center ring-1 ring-gray-600 rounded-xl shadow-md'
                }`}
            >
                {items.length > 0 ? (
                    <>
                        <div className="flex flex-col w-full lg:w-1/2 p-4 ring-1 ring-gray-600 bg-stone-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="flex gap-2 items-center p-4 tracking-tighter text-xl font-semibold border-b border-gray-700 pb-3">
                                <IoCalendarNumberOutline className="text-blue-400" />
                                Recent products (last {days} days)
                            </h2>
                            <div className="flex flex-col gap-4 pb-4 px-2 mt-2">
                                <div className="flex flex-col gap-3">
                                    {items
                                        .filter(
                                            ({
                                                current_quantity,
                                                created_at,
                                            }) => {
                                                const limitDate = new Date();
                                                limitDate.setDate(
                                                    limitDate.getDate() - days
                                                );
                                                return (
                                                    new Date(created_at!) >=
                                                        limitDate &&
                                                    current_quantity >= 10
                                                );
                                            }
                                        )
                                        .slice(0, 5)
                                        .map(
                                            ({
                                                item_id,
                                                name,
                                                category_id,
                                                current_quantity,
                                                price_cents,
                                            }) => (
                                                <CardProduct
                                                    key={item_id}
                                                    itemId={item_id!}
                                                    nameProduct={name}
                                                    categoryId={category_id}
                                                    quantity={current_quantity}
                                                    price={formatPrice(
                                                        price_cents
                                                    )}
                                                />
                                            )
                                        )}
                                </div>
                                <ButtonLink
                                    to={'/products'}
                                    onClick={() => {
                                        setCategorySelect('All Categories');
                                    }}
                                    className="border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-md hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                    text="See all Products"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full lg:w-1/2 p-4 ring-1 ring-gray-600 bg-stone-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="flex gap-2 items-center p-4 tracking-tighter text-xl font-semibold border-b border-gray-700 pb-3">
                                <FiAlertTriangle className="text-red-400" />
                                Low Stock (less than 10 units)
                            </h2>
                            <div className="flex flex-col gap-4 pb-4 px-2 mt-2">
                                {items.some(
                                    ({ current_quantity }) =>
                                        current_quantity < quantityLimit
                                ) ? (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            {items
                                                .filter(
                                                    ({ current_quantity }) =>
                                                        current_quantity <
                                                        quantityLimit
                                                )
                                                .slice(0, 5)
                                                .map(
                                                    ({
                                                        item_id,
                                                        name,
                                                        category_id,
                                                        current_quantity,
                                                        price_cents,
                                                    }) => (
                                                        <CardProduct
                                                            key={item_id}
                                                            itemId={item_id!}
                                                            nameProduct={name}
                                                            categoryId={
                                                                category_id
                                                            }
                                                            quantity={
                                                                current_quantity
                                                            }
                                                            price={formatPrice(
                                                                price_cents
                                                            )}
                                                        />
                                                    )
                                                )}
                                        </div>
                                        <ButtonLink
                                            to={'/products'}
                                            onClick={() => {
                                                setCategorySelect('Low Stock');
                                            }}
                                            className="justify-self-end border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-md hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                            text="View all low stock items"
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 p-6 md:py-8 md:px-12 bg-gradient-to-b from-stone-800 to-stone-900 rounded-lg mt-2">
                                        <div className="flex items-center justify-center text-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-full p-5 w-16 h-16 shadow-lg">
                                            <span>✓</span>
                                        </div>
                                        <h3 className="font-bold text-green-400 text-xl">
                                            Congratulations!
                                        </h3>
                                        <p className="text-sm text-center text-gray-300">
                                            All product stocks are fully
                                            stocked. Excellent management and
                                            planning work!
                                        </p>
                                        <div className="flex gap-5 text-center px-5 py-3 rounded-md bg-amber-100 shadow-inner mt-2">
                                            <div className="flex items-center flex-col gap-1">
                                                <span className="font-bold text-green-600 text-xl">
                                                    100%
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Current Stock
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-col gap-1">
                                                <span className="font-bold text-green-600 text-xl">
                                                    0
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Missing Products
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-col gap-1">
                                                <span className="font-bold text-green-600 text-xl">
                                                    100%
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    Availability
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-5 text-center text-white py-10 px-6 bg-stone-900 rounded-xl shadow-md w-full">
                        <span className="text-3xl text-sky-400 w-12 h-12">
                            <BsBoxSeam className="size-full" />
                        </span>
                        <h3 className="font-medium text-lg">
                            No products found
                        </h3>
                        <p className="font-light text-gray-300 text-sm">
                            Start by adding your first product to inventory.
                        </p>
                        <ButtonLink
                            className="flex gap-2 items-center text-white p-3 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-gray-900 mt-2"
                            to="/products/new"
                            text="Add Product"
                            icon={<IoMdAdd />}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
