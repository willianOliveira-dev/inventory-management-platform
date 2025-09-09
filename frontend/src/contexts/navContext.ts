import { createContext } from 'react';
import type { NavContexType } from '../types';

const NavContext = createContext<NavContexType | null>(null);

export default NavContext;
