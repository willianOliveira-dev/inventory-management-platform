import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BurgerMenuProvider from '../providers/BugerMenuProvider';
import NavProvider from '../providers/NavProvider';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <NavProvider>
                <BurgerMenuProvider>
                    <Header />
                    <Sidebar />
                </BurgerMenuProvider>
                <MainContent />
            </NavProvider>
            <Footer />
        </DashboardLayout>
    );
}
