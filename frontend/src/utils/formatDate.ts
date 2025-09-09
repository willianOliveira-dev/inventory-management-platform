export default function formatDate(date: Date): string {
    const dateFormat = new Date(date);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(dateFormat);
}
