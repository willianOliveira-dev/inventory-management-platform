import { createContext } from 'react';
import { type BurgerContextType } from '../types/context/burgerContextType';

const BurgerMenuContext = createContext<BurgerContextType | null>(null);

export default BurgerMenuContext;
