import { useContext } from 'react';
import CategoryContext from '../contexts/categoryContext';

export function useCategories() {
    
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error(
            'useCategories must be used within an CategoryProvider'
        );
    }

    return context;
}
