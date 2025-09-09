import NavContext from '../contexts/navContext';
import { useContext } from 'react';

export function useNav() {
    const context = useContext(NavContext);
    if (!context) {
        throw new Error('useNav must be used within an NavProvider');
    }
    return context;
}
