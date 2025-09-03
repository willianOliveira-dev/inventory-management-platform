import PageTransitionLoader from '../ui/PageTransitionLoader';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { type ProtectedRoute } from '../../types';

export default function ProtectedRoute({ children }: ProtectedRoute) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <PageTransitionLoader active />;
    }

    if (!user) {
        return <Navigate to={'/login'} replace></Navigate>;
    }

    return <>{children}</>;
}
