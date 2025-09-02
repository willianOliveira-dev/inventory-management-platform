import Logo from '../assets/logo.png';
import { useNavigation } from 'react-router-dom';

export default function PageTransitionLoader() {
    const navigation = useNavigation();

    if (navigation.state !== 'loading') {
        return null;
    }

    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_50%)]"></div>

                <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                <div
                    className="absolute top-2/3 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{ animationDelay: '700ms' }}
                ></div>
                <div
                    className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-ping"
                    style={{ animationDelay: '1400ms' }}
                ></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center">
                <div className="mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 border-2 border-transparent rounded-full border-t-blue-500 border-r-purple-500 animate-spin mx-auto"></div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-cyan-400/50 rounded-full animate-pulse">
                            <img src={Logo} alt="Logo" loading="lazy" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-light text-white mb-2 tracking-widest">
                    ESTOQUE
                    <span className="font-bold text-violet-700">PRO</span>
                </h1>

                <div className="w-64 mx-auto mb-4">
                    <div className="h-0.5 bg-stone-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full animate-[progressPulse_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse"></div>
            <div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse"
                style={{ animationDelay: '1000ms' }}
            ></div>

            <style>
                {`
          @keyframes progressPulse {
            0% { width: 0%; opacity: 0.7; }
            50% { width: 75%; opacity: 1; }
            100% { width: 100%; opacity: 0.7; }
          }
          
          @keyframes counting {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          
          .animate-counting {
            animation: counting 1.5s ease-in-out infinite;
          }
        `}
            </style>
        </div>
    );
}
