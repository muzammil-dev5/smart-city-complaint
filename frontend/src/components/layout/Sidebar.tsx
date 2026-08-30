
import { Button, Box, Typography } from "@mui/material";
import {
    adminMenu,
    citizenMenu,
    officerMenu,
    workerMenu,
} from "../../constants/sidebarMenu";
import type { MenuItem } from "../../constants/sidebarMenu";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const role = user?.role;

    let menuItems: MenuItem[] = [];

    if (role === "admin") {
        menuItems = adminMenu;
    } else if (role === "officer") {
        menuItems = officerMenu;
    } else if (role === "citizen") {
        menuItems = citizenMenu;
    } else if (role === "worker") {
        menuItems = workerMenu;
    }

    return (
        <Box className={`sidebar sidebar-${role}`}>

            {/* Brand / Header */}
            <Box className="sidebar-header">
                <Box className="sidebar-logo">
                    SC
                </Box>

                <Box className="sidebar-brand">
                    <Typography className="sidebar-brand-title">
                        Smart City
                    </Typography>

                    <Typography className="sidebar-brand-subtitle">
                        Complaint Management
                    </Typography>
                </Box>
            </Box>

            {/* Navigation Label */}
            <Typography className="sidebar-section-title">
                MENU
            </Typography>

            {/* Navigation */}
            <Box className="sidebar-navigation">
                {menuItems.map((item) => (
                    <Box
                        className="sidebar-item"
                        key={item.path}
                    >
                        <Button
                            component={NavLink}
                            to={item.path}
                            variant="contained"
                            startIcon={item.icon}
                            className="sidebar-button"
                        >
                            <span className="sidebar-label">
                                {item.label}
                            </span>
                        </Button>
                    </Box>
                ))}
            </Box>

            {/* Bottom Info */}
            <Box className="sidebar-bottom">

                <Box className="sidebar-status-dot" />

                <Box>
                    <Typography className="sidebar-status-title">
                        System Online
                    </Typography>

                    <Typography className="sidebar-status-text">
                        City services are active
                    </Typography>
                </Box>

            </Box>

        </Box>
    );
};

export default Sidebar;
