import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Siderbar";
import HeaderUser from "../components/navigation/user/HeaderUser";
import AsideUser from "../components/aside/AsideUser";
import BoletoButtom from "../components/BoletoButtom";
import { useToast } from "../components/Toast";

const UserContainer: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { ToastComponent } = useToast();

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
            
            {/* Botón flotante del boleto */}
            <BoletoButtom />
            
            {/* Sistema de notificaciones Toast */}
            {ToastComponent}
        </div>
    );
};

export default UserContainer;