import AOS from 'aos';
import AuthProvider from './providers/AuthProvider';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import 'aos/dist/aos.css';

export default function App() {
    AOS.init();
    return (
        <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
    );
}
