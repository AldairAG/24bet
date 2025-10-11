import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Siderbar";
import HeaderUser from "../components/navigation/user/HeaderUser";
import AsideUser from "../components/aside/AsideUser";

const UserContainer: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div>
                <HeaderUser onMenuToggle={toggleSidebar} />
            </div>
            <div>
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            </div>
            <div className="flex">
                <AsideUser />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserContainer;