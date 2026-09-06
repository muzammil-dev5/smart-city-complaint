import {
    Box,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";

import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

import {
    adminMenu,
    citizenMenu,
    officerMenu,
    workerMenu,
} from "../../constants/sidebarMenu";

import type { MenuItem } from "../../constants/sidebarMenu";
import { NavLink } from "react-router-dom";

import "./Sidebar.scss";

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

const Sidebar = ({ open, onToggle }: SidebarProps) => {
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

    const roleName =
        role === "admin"
            ? "Administrator"
            : role === "officer"
                ? "Department Officer"
                : role === "worker"
                    ? "Field Worker"
                    : "Citizen";

    return (
        <Box className={`sidebar sidebar-${role} ${open ? "is-open" : "is-collapsed"}`}>

            {/* =====================================
                HEADER
            ===================================== */}

            <Box className="sidebar-header">

                <Box className="sidebar-brand-wrapper">

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

                <Tooltip
                    title={open ? "Collapse sidebar" : "Expand sidebar"}
                    placement="right"
                    arrow
                >
                    <IconButton
                        onClick={onToggle}
                        className="sidebar-toggle"
                    >
                        {open ? (
                            <MenuOpenRoundedIcon />
                        ) : (
                            <MenuRoundedIcon />
                        )}
                    </IconButton>
                </Tooltip>

            </Box>


            {/* =====================================
                ROLE
            ===================================== */}

            <Box className="sidebar-role">

                <Box className="sidebar-role-indicator" />

                <Typography className="sidebar-role-text">
                    {roleName}
                </Typography>

            </Box>


            {/* =====================================
                MENU TITLE
            ===================================== */}

            <Typography className="sidebar-section-title">
                NAVIGATION
            </Typography>


            {/* =====================================
                NAVIGATION
            ===================================== */}

            <Box className="sidebar-navigation">

                {menuItems.map((item) => {

                    const button = (
                        <Box
                            component={NavLink}
                            to={item.path}
                            className="sidebar-button"
                        >

                            <Box className="sidebar-icon">
                                {item.icon}
                            </Box>

                            <Typography className="sidebar-label">
                                {item.label}
                            </Typography>

                        </Box>
                    );

                    return (
                        <Box
                            className="sidebar-item"
                            key={item.path}
                        >

                            {!open ? (
                                <Tooltip
                                    title={item.label}
                                    placement="right"
                                    arrow
                                >
                                    {button}
                                </Tooltip>
                            ) : (
                                button
                            )}

                        </Box>
                    );
                })}

            </Box>


            {/* =====================================
                SYSTEM STATUS
            ===================================== */}

            <Box className="sidebar-footer">

                <Box className="sidebar-status">

                    <Box className="sidebar-status-icon">
                        <CircleRoundedIcon />
                    </Box>

                    <Box className="sidebar-status-content">

                        <Typography className="sidebar-status-title">
                            System Online
                        </Typography>

                        <Typography className="sidebar-status-text">
                            City services active
                        </Typography>

                    </Box>

                </Box>

            </Box>

        </Box>
    );
};

export default Sidebar;