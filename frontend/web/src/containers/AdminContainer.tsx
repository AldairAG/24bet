import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/navigation/admin/HeaderAdmin";

const AdminContainer: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50">
            <HeaderAdmin />
            <main className="w-full max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminContainer;
