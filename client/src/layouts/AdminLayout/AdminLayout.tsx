import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/header';
import Sidebar from '../../components/Sidebar/Sidebar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#F6FFE7] w-full">
            <div className="lg:hidden">
                <Header />
                <main className="pb-16 sm:pb-20">
                    <Outlet />
                </main>
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-black">
                    <Sidebar isMobile={true} />
                </div>
            </div>

            <div className="hidden lg:flex h-screen">
                <div className="hidden xl:block w-64 shrink-0">
                    <div className="h-full p-4">
                        <Sidebar />
                    </div>
                </div>

                <div className="hidden lg:block xl:hidden w-20 shrink-0">
                    <div className="h-full p-2">
                        <Sidebar isCompact={true} />
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
