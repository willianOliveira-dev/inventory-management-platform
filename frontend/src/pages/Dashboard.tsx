import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Header />
            <Sidebar />
            <MainContent />
            <Footer />
        </DashboardLayout>
    );
}
