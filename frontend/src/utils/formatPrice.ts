export default function formatPrice(priceCents: number): string {
    const price = priceCents / 100;
    const priceFormat = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
    return priceFormat;
}
