import Login from '../pages/Login';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Product from '../pages/Product';
import Home from '../pages/Home';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import productLoader from '../loaders/productLoader';
import ErrorBoundary from '../errors/ErrorBoundary';
import EditProduct from '../pages/EditProduct';
import Categories from '../pages/Categories';
import AddCategory from '../pages/addCategory';
import EditCategory from '../pages/EditCategory';
import categoryLoader from '../loaders/categoryLoader';
import { createBrowserRouter } from 'react-router-dom';
import Reports from '../pages/Reports';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'products',
                element: <Products />,
            },
            {
                path: 'products/new',
                element: <AddProduct />,
            },
            {
                path: 'products/:itemId',
                element: <Product />,
                loader: productLoader,
                errorElement: <ErrorBoundary />,
            },
            {
                path: 'products/:itemId/edit',
                element: <EditProduct />,
                loader: productLoader,
                errorElement: <ErrorBoundary />,
            },
            {
                path: 'categories',
                element: <Categories />,
            },
            {
                path: 'categories/new',
                element: <AddCategory />,
            },
            {
                path: 'categories/:categoryId/edit',
                loader: categoryLoader,
                element: <EditCategory />,
                errorElement: <ErrorBoundary />,
            },
            { path: 'reports', element: <Reports /> },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
]);

export default router;
