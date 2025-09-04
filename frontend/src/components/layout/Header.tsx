import { useAuth } from '../../hooks/useAuth';

export default function Header() {
    const { user } = useAuth();
    const dateNow: number = Date.now();
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const dateFormat: string = dateTimeFormat.format(dateNow);
    return (
        <header className='md:col-start-2 p-2 bg-stone-950 shadow-xl/50 '>
            <div className='flex items-center justify-between py-2 px-4'>
                <span className="bg-gradient-to-r bg-clip-text from-violet-400 via-violet-500 to-violet-700 text-transparent">{dateFormat}</span>
                <h2 className='text-3xl font-light text-white tracking-tighter'>Hello, <span className='text-violet-700 font-bold'>{user?.name!} !</span></h2>
            </div>
        </header>
    );
}
