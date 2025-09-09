import { Outlet } from 'react-router-dom';
import CategoryProvider from '../../providers/CategoryProvider';
import ItemProvider from '../../providers/ItemProvider';

export default function MainContent() {
    return (
        <main className="flex-1 overflow-y-auto">
            <ItemProvider>
                <CategoryProvider>
                    <Outlet />
                </CategoryProvider>
            </ItemProvider>
        </main>
    );
}
