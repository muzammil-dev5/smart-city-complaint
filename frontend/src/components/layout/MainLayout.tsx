import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import type { MenuItem } from "../../constants/sidebarMenu";
import { adminMenu, officerMenu, citizenMenu, workerMenu } from "../../constants/sidebarMenu";
const MainLayout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = user?.role;
    let menuItems: MenuItem[] = [];

    if (role === "admin") {
        menuItems = adminMenu;
    }
    else if (role === "officer") {
        menuItems = officerMenu;
    }
    else if (role === "citizen") {
        menuItems = citizenMenu;
    }
    else if (role === "worker") {
        menuItems = workerMenu;
    }
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Navbar />

            <Box
                sx={{
                    display: "grid",
                    gap: "16px",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "15% 84%",
                    },
                    minHeight: "calc(100vh - 65px)",
                    padding: "16px"
                }}
            >
                {/* Sidebar */}
                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,
                    }}>
                    <Sidebar />
                </Box>

                {/* Main Content */}
                <Box
                    className={`${role}-Dashboard`}
                    sx={{
                        // width: "100%",
                        // minWidth: 0,
                        // overflowX: "hidden",
                        // p: 2,
                    }}>
                    <Outlet />
                </Box>
            </Box>

        </Box>
    );
}

export default MainLayout;
