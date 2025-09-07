import AuthContext from '../contexts/authContext';
import { useContext } from 'react';
import type { AuthContextType } from '../types';

export function useAuth() {
    const context: AuthContextType | undefined = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
