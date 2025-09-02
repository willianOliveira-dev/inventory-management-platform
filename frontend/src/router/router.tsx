import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// react-router-dom - biblioteca vai criar o roteador
// create-router-dom - simular o uso do navegador,
const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    }
]);

export default router;
