// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store/store";

// const ProtectedRoute = () => {
//     const { isAuthenticated } = useSelector(
//         (state: RootState) => state.auth
//     );

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;