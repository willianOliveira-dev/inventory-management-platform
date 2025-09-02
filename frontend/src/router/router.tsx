import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import Register from '../pages/Register';
import Dashboard from '../pages/Login';
import { createBrowserRouter } from 'react-router-dom';

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
    {
        path: "/register",
        element: <Register/>
    },
]);

export default router;
