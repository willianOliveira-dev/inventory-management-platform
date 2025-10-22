import router from './router/router';
import AOS from 'aos';
import AuthProvider from './providers/AuthProvider';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import 'aos/dist/aos.css';

export default function App() {
    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <AuthProvider>
            <Toaster  />
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
    );
}
