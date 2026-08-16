import type { ReactNode } from "react";
import type { UserRole } from "../types/user";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";



interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}


export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}