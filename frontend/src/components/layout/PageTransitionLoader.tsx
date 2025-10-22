import Logo from '../../assets/logo.png';
import { type PageTransitionLoader } from '../../types';

export default function PageTransitionLoader({
    active = false,
}: PageTransitionLoader) {
    if (!active) return null;

    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center space-x-8">
            <div className="relative">
                {/* Loader Spinner em volta da logo */}
                <div className="w-32 h-32 border-4 border-t-blue-500 border-r-purple-500 rounded-full animate-spin mx-auto"></div>

                {/* Logo centralizada */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24">
                    <img
                        src={Logo}
                        alt="Logo"
                        loading="lazy"
                        className="w-full h-full"
                    />
                </div>
            </div>

            <h1 className="text-4xl text-white mt-8 text-center tracking-tighter font-bold">
                Stock
                <span className="bg-gradient-to-r bg-clip-text text-transparent from-violet-500 via-violet-700 to-violet-900">
                    Wise
                </span>
            </h1>
        </div>
    );
}
