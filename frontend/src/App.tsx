import AuthProvider from './providers/AuthProvider';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
    );
}
