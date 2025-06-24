import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const ProtectedRoute = () => {
    const { accessToken } = useAuthStore();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};