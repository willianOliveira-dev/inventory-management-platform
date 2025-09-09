import PageTransitionLoader from '../layout/PageTransitionLoader';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <PageTransitionLoader active />;
    }

    if (!user) {
        return <Navigate to={'/login'} replace></Navigate>;
    }

    return <>{children}</>;
}
