import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div>
            <Header />
            <Sidebar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
