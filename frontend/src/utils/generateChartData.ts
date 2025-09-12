import type { Item } from '../types';

export default function generateChartData(
    items: Item[],
    days: number
): [{ day: string; count: number }[], number] {
    const format = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });

    const now: Date = new Date();
    const counts: Record<string, number> = {};
    const limit: Date = new Date();
    limit.setDate(now.getDate() - days);

    for (let i = days - 1; i >= 0; i--) {
        const d: Date = new Date();
        d.setDate(now.getDate() - i);
        const key: string = format.format(d);
        counts[key] = 0;
    }

    items.forEach(({ created_at }) => {
        const date: Date = new Date(created_at!);
        const dateFormat: string = format.format(date);
        if (counts[dateFormat] !== undefined) {
            counts[dateFormat]++;
        }
    });

    const recentProducts = Object.entries(counts).map(([day, count]) => ({
        day,
        count,
    }));

    const dayCount = items.filter(
        ({ created_at }) => new Date(created_at!) >= limit
    ).length;

    return [recentProducts, dayCount];
}
