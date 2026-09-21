import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRecentUsers } from "../../services/userService";
import type { User } from "../../types/user";

import "./RecentUsers.scss";

const RecentUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            try {
                setLoading(true);

                const response =
                    await getRecentUsers(6);

                setUsers(response.users || []);
            } catch (error) {
                console.error(
                    "Failed to fetch recent users:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecentUsers();
    }, []);

    const getRoleLabel = (
        role: User["role"]
    ) => {
        switch (role) {
            case "admin":
                return "Admin";

            case "officer":
                return "Officer";

            case "worker":
                return "Worker";

            case "citizen":
                return "Citizen";

            default:
                return role;
        }
    };

    if (loading) {
        return (
            <Box className="recentUsers-loading">
                <CircularProgress size={28} />

                <Typography>
                    Loading recent users...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="recentUsers">

            {/* ================= HEADER ================= */}

            <Box className="recentUsers-header">

                <Box>
                    <Typography className="recentUsers-title">
                        Recent Users
                    </Typography>

                    <Typography className="recentUsers-subtitle">
                        Latest registered users
                    </Typography>
                </Box>

                <Button
                    className="recentUsers-viewAll"
                    variant="text"
                    onClick={() =>
                        navigate("/admin/users")
                    }
                >
                    View All Users
                </Button>

            </Box>

            {/* ================= TABLE ================= */}

            {users.length === 0 ? (
                <Box className="recentUsers-empty">
                    <Typography>
                        No users found.
                    </Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table>

                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    Name
                                </TableCell>

                                <TableCell>
                                    Email
                                </TableCell>

                                <TableCell>
                                    Role
                                </TableCell>

                                <TableCell>
                                    Department
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Created
                                </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {users.map((user) => (
                                <TableRow
                                    key={user._id}
                                    className="recentUsers-row"
                                >

                                    <TableCell>
                                        <Typography className="user-name">
                                            {user.name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography className="user-email">
                                            {user.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={getRoleLabel(
                                                user.role
                                            )}
                                            size="small"
                                            className={`role-chip role-${user.role}`}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Typography className="user-department">
                                            {user.department?.name ||
                                                "—"}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={
                                                user.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            size="small"
                                            className={
                                                user.isActive
                                                    ? "status-active"
                                                    : "status-inactive"
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Typography className="user-date">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>
                </TableContainer>
            )}

        </Box>
    );
};

export default RecentUsers;