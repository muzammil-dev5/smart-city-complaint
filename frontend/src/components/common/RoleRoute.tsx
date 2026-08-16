import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

type Role = "citizen" | "officer" | "worker" | "admin";

type RoleRouteProps = {
    allowedRoles: Role[];
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;