import { Button, Typography, Box, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
            }}
        >
            <Typography variant="h5">Smart City</Typography>

            <Box style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <Typography>
                    {user?.name ?? "Guest"}
                </Typography>

                <Typography>
                    {user?.role}
                </Typography>

                <Avatar>
                    {user?.name?.charAt(0)}
                </Avatar>

                <Button variant="contained" onClick={logout}>
                    Logout
                </Button>
            </Box>
        </Box>
    );
};

export default Navbar;