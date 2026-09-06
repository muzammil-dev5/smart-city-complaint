import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "./MainLayout.scss";

const MainLayout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = user?.role;

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleSidebarToggle = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <Box className="main-layout">
            <Navbar />

            <Box className="main-layout-body">

                {/* SIDEBAR */}
                <Box
                    className={`main-layout-sidebar ${
                        sidebarOpen
                            ? "sidebar-expanded"
                            : "sidebar-collapsed"
                    }`}
                >
                    <Sidebar
                        open={sidebarOpen}
                        onToggle={handleSidebarToggle}
                    />
                </Box>

                {/* MAIN CONTENT */}
                <Box
                    className={`main-layout-content ${role}-Dashboard`}
                >
                    <Outlet />
                </Box>

            </Box>
        </Box>
    );
};

export default MainLayout;