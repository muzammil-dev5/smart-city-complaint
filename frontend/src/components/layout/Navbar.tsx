import { Button, Typography, Box, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

interface User {
    name: string;
    role: string;
}
const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };


    const storedUser = localStorage.getItem("user");

    const user: User | null = storedUser
        ? JSON.parse(storedUser)
        : null;

    const role = user?.role ?? "guest";

    return (
        <Box className={`Navbar navbar-${role}`}>

            {/* Brand */}
            <Box className="navbar-brand">
                <Typography className="brand-title">
                    Smart City
                </Typography>

                <Typography className="brand-subtitle">
                    Complaint Management
                </Typography>
            </Box>

            {/* User Section */}
            <Box className="navbar-user">

                <Box className="user-info">
                    <Typography className="user-name">
                        {user?.name ?? "Guest"}
                    </Typography>

                    <Typography className="user-role">
                        {user?.role ?? "Guest"}
                    </Typography>
                </Box>

                <Avatar className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase() ?? "G"}
                </Avatar>

                <Button
                    className="logout-btn"
                    variant="contained"
                    onClick={logout}
                >
                    Logout
                </Button>

            </Box>

        </Box>
    );
};

export default Navbar;