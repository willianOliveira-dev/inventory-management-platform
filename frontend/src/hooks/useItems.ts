import ItemContext from '../contexts/itemContext';
import { useContext } from 'react';

export function useItems() {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error(
            'useItems must be used within an ItemProvider'
        );
    }
    return context;
}
