import type { DashboardLayout } from '../../types';

export default function DashboardLayout({ children }: DashboardLayout) {
    return (
        <div className="relative bg-stone-950 min-h-screen xl:grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
            {children}
        </div>
    );
}
