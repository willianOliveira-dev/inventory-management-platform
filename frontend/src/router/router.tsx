import Login from '../pages/Login';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home'
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [{
            index: true,
            element: <Home/>
        }]
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
