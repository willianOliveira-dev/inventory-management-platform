import { useState } from 'react';
import NavContext from '../contexts/navContext';
import { type ReactNode } from 'react';

export default function NavProvider({ children }: { children: ReactNode }) {
    const [nav, setNav] = useState<string>('');

    const value = {
        nav,
        setNav,
    };
    
    return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
