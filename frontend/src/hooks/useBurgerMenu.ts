import { useContext } from 'react';
import BurgerMenuContext from '../contexts/burgerMenuContext';

export function useBurgerMenu() {
    const context = useContext(BurgerMenuContext);

    if (!context) {
        throw new Error('useBurger must be used within an BurgerMenuProvider');
    }
    return context;
}
