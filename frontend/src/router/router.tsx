import Login from '../pages/Login';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Product from '../pages/Product';
import Home from '../pages/Home';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import productLoader from '../loaders/productLoader';
import ProductBoundary from '../errors/ProductBoundary';
import EditProduct from '../pages/EditProduct';
import Categories from '../pages/Categories';
import AddCategory from '../pages/addCategory';
import EditCategory from '../pages/EditCategory';
import categoryLoader from '../loaders/categoryLoader';
import { createBrowserRouter } from 'react-router-dom';

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
                errorElement: <ProductBoundary />,
            },
            {
                path: 'products/new',
                element: <AddProduct />,
            },
            {
                path: 'products/:itemId',
                element: <Product />,
                loader: productLoader,
                errorElement: <ProductBoundary />,
            },
            {
                path: 'products/:itemId/edit',
                element: <EditProduct />,
                loader: productLoader,
                errorElement: <ProductBoundary />,
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
            },
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
