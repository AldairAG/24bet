import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Siderbar";
import HeaderUser from "../components/navigation/user/HeaderUser";

const UserContainer: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div>
            <div>
                <HeaderUser onMenuToggle={toggleSidebar} />
            </div>
            <div>
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default UserContainer;