import { createContext } from 'react';
import { type CategoryContextType } from '../types';

const CategoryContext = createContext<CategoryContextType | null>(null);

export default CategoryContext;