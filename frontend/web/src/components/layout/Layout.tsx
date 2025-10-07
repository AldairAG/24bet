import React, { useState } from 'react';
import HeaderUser from '../navigation/user/HeaderUser';
import Sidebar from '../navigation/Siderbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <HeaderUser onMenuToggle={toggleSidebar} />
            
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            
            {/* Main Content */}
            <main className="transition-all duration-300">
                {children}
            </main>
        </div>
    );
};

export default Layout;