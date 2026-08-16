import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

const MainLayout = () => {
    return (
        <Box>
            <Navbar />
            <Box>
                <Sidebar />
                <Box>
                    <Outlet />
                </Box>
            </Box>

        </Box>
    );
}

export default MainLayout;
