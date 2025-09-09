import { createContext } from 'react';
import { type ItemContextType } from '../types';

const ItemContext = createContext<ItemContextType | null>(null);

export default ItemContext;
