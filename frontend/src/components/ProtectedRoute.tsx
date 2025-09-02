import type { ProtectedRoute } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import PageTransitionLoader from './PageTransitionLoader';

export default function ProtectedRoute({ children }: ProtectedRoute) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <PageTransitionLoader />;
    }

    if (!user) {
        return <Navigate to={'/login'} replace></Navigate>;
    }

    return <>{children}</>;
}
