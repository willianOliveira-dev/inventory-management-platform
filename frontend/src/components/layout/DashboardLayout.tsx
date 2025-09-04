import type { DashboardLayout } from '../../types';

export default function DashboardLayout({ children }: DashboardLayout) {
    return (
        <div className="relative grid grid-cols-[1fr] grid-rows-[auto_1fr_auto] md:grid-cols-[auto_1fr] bg-stone-950 min-h-screen">
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
            {children}
        </div>
    );
}
