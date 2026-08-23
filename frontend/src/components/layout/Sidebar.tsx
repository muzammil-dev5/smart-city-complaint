import { Button } from "@mui/material";
import {
    adminMenu,
    citizenMenu,
    officerMenu,
    workerMenu,
} from "../../constants/sidebarMenu";
import type { MenuItem } from "../../constants/sidebarMenu";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {

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
        <div className={`sidebar sidebar-${role}`}>
            {menuItems.map((item) => (
                <div
                    className="sidebar-item"
                    key={item.path}
                >
                    <Button
                        component={Link}
                        to={item.path}
                        variant="contained"
                        startIcon={item.icon}
                    >
                        {item.label}
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;