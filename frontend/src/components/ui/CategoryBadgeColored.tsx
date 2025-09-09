import { useEffect, useState, useMemo } from 'react';

export default function CategoryBadgeColored({
    category,
}: {
    category: string;
}) {
    const [categoryColors, setCategoryColors] = useState<{
        [category: string]: [string, string];
    }>(() => JSON.parse(localStorage.getItem('categoryColors') || '{}'));

    useEffect(() => {
        localStorage.setItem('categoryColors', JSON.stringify(categoryColors));
    }, [categoryColors]);

    const [bgColor, textColor] = useMemo(() => {
        if (!categoryColors[category]) {
            const random: number = Math.floor(Math.random() * 360);
            const bg: string = `hsl(${random}, 70%, 80%)`;
            const fg: string = `hsl(${random}, 70%, 50%)`;

            setCategoryColors((prev) => ({
                ...prev,
                [category]: [bg, fg],
            }));

            return [bg, fg];
        }
        return categoryColors[category];
    }, [category, categoryColors]);

    return (
        <span
            style={{
                backgroundColor: bgColor,
                color: textColor,
            }}
            className="p-[4px] text-xs rounded-full"
        >
            {category}
        </span>
    );
}
