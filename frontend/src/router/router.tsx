import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Login';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: <Login />,
    },
    {},
]);

export default router;
