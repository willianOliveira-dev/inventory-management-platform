export default function CardAnalysis({
    category,
    productCount,
    totalValueByCategory,
    totalPercentageInStock,
}: {
    category: string;
    productCount: number;
    totalValueByCategory: string;
    totalPercentageInStock: String;
}) {
    return (
        <div className="space-y-2 bg-stone-800 rounded-md w-full p-2 text-white">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold">{category}</h2>
                <span className="text-gray-300 font-semibold">{totalValueByCategory}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
                <span className="text-gray-300 text-sm" >{productCount} products</span>
                <span className="text-gray-300 text-sm">{totalPercentageInStock} do Total</span>
            </div>
        </div>
    );
}
