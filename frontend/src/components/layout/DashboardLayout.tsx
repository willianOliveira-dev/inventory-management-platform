import { type ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative bg-stone-950 flex flex-col h-screen xl:grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
            {children}
        </div>
    );
}
