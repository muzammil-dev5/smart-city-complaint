import {
    Box, Paper, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getComplaintAnalytics } from "../../services/complaintService";
import { getAllUsers } from "../../services/userService";
import UserTable from "../../components/Table/UserTable";
import type { User, RoleFilter } from "../../types/user";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [search, setSearch] = useState("");
    const [analytics, setAnalytics] = useState({
        total: 0,
        pending: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        categories: {
            roadDamage: 0,
            streetLight: 0,
            garbageCollection: 0,
        },
    });

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const filteredUsers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const handleRoleUpdated = (
        userId: string,
        role: User["role"]
    ) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user._id === userId
                    ? { ...user, role }
                    : user
            )
        );
    };

    const handleStatusUpdated = (
        userId: string,
        isActive: boolean
    ) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user._id === userId
                    ? { ...user, isActive }
                    : user
            )
        );
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersResponse, analyticsResponse] =
                    await Promise.all([
                        getAllUsers(),
                        getComplaintAnalytics(),
                    ]);

                setUsers(usersResponse.users);
                setAnalytics(analyticsResponse.analytics);
            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box className="adminDashboard-loading">
                <CircularProgress />
                <Typography>
                    Loading dashboard...
                </Typography>
            </Box>
        );
    }

    const analyticsCards = [
        {
            title: "Pending",
            value: analytics.pending,
            className: "pending",
        },
        {
            title: "Assigned",
            value: analytics.assigned,
            className: "assigned",
        },
        {
            title: "In Progress",
            value: analytics.inProgress,
            className: "in-progress",
        },
        {
            title: "Resolved",
            value: analytics.resolved,
            className: "resolved",
        },
        {
            title: "Rejected",
            value: analytics.rejected,
            className: "rejected",
        },
    ];

    return (
        <Box className="adminDashboard-page">
            <Box className="adminDashboard">
                <Box className="adminDashboard-content">
                    <Typography className="adminDashboard-header">
                        Admin Dashboard
                    </Typography>

                    <Typography className="adminDashboard-title">
                        Manage and monitor the Smart City Complaint Management System.
                    </Typography>
                </Box>

                <Box className="adminComplaints-count">
                    <Typography className="count-label">
                        Total Complaints
                    </Typography>

                    <Typography className="count-number">
                        0
                    </Typography>
                </Box>
            </Box>

            <Box className="Analytics-dashboard-card">
                {analyticsCards.map((card) => (
                    <Paper
                        elevation={0}
                        key={card.title}
                        className={`Analytics-card ${card.className}`}>
                        <Box>
                            <Typography className="Analytics-title">
                                {card.title}
                            </Typography>

                            <Typography className="Analytics-description">
                                Complaint overview
                            </Typography>
                        </Box>

                        <Box className="Analytics-count">
                            {card.value}
                        </Box>
                    </Paper>
                ))}
            </Box>

            <Box className="charts">
                <Paper
                    elevation={0}
                    className="chart-card">
                    <Box className="chart-card-header">
                        <Box>
                            <Typography className="chart-heading">
                                Complaints by Category
                            </Typography>

                            <Typography className="chart-title">
                                Distribution across complaint categories
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="chart-wrapper">
                        <BarChart
                            xAxis={[
                                {
                                    scaleType: "band",
                                    data: [
                                        "Road Damage",
                                        "Street Light",
                                        "Garbage Collection",
                                    ],
                                },
                            ]}
                            series={[
                                {
                                    data: [
                                        analytics.categories.roadDamage,
                                        analytics.categories.streetLight,
                                        analytics.categories.garbageCollection,
                                    ],
                                    label: "Complaints",
                                },
                            ]}
                            height={250}
                            sx={{
                                width: "100%",
                            }} />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    className="chart-card">
                    <Box className="chart-card-header">
                        <Box>
                            <Typography className="chart-heading">
                                Complaints by Status
                            </Typography>

                            <Typography className="chart-title">
                                Current complaint status distribution
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="chart-wrapper pie-wrapper">
                        <PieChart
                            series={[
                                {
                                    data: [
                                        {
                                            id: 0,
                                            value: analytics.pending,
                                            label: "Pending",
                                        },
                                        {
                                            id: 1,
                                            value: analytics.assigned,
                                            label: "Assigned",
                                        },
                                        {
                                            id: 2,
                                            value: analytics.inProgress,
                                            label: "In Progress",
                                        },
                                        {
                                            id: 3,
                                            value: analytics.resolved,
                                            label: "Resolved",
                                        },
                                        {
                                            id: 4,
                                            value: analytics.rejected,
                                            label: "Rejected",
                                        },
                                    ],
                                    outerRadius: 88,
                                    innerRadius: 52,
                                    paddingAngle: 2,
                                },
                            ]}
                            height={250}
                            sx={{
                                width: "100%",
                                maxWidth: 450,
                            }}
                        />
                    </Box>
                </Paper>
            </Box>

            <Paper
                className="adminDataTable"
                elevation={0}>
                <Box className="adminDataTable-Header">
                    <Box className="adminDataTable-Info">
                        <Typography className="adminDataTable-Heading">
                            User Management
                        </Typography>

                        <Typography className="adminDataTable-Subtitle">
                            Manage registered users and their access
                        </Typography>
                    </Box>

                    <Box className="adminDataTable-filters">
                        <TextField
                            className="dataTableSearchFilter"
                            value={search}
                            label="Search Users"
                            placeholder="Search by name or email..."
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <FormControl className="roleFilter">
                            <InputLabel id="role-filter-label">
                                Role
                            </InputLabel>
                            <Select
                                labelId="role-filter-label"
                                value={roleFilter}
                                label="Role"
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value as RoleFilter
                                    )
                                }>
                                <MenuItem value="all">
                                    All Roles
                                </MenuItem>

                                <MenuItem value="citizen">
                                    Citizen
                                </MenuItem>

                                <MenuItem value="officer">
                                    Officer
                                </MenuItem>

                                <MenuItem value="worker">
                                    Worker
                                </MenuItem>

                                <MenuItem value="admin">
                                    Admin
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <UserTable
                    users={filteredUsers}
                    onRoleUpdated={handleRoleUpdated}
                    onStatusUpdated={handleStatusUpdated}
                    currentUserId={
                        currentUser?._id ??
                        currentUser?.id
                    }
                />
            </Paper>
        </Box>
    );
};

export default AdminDashboard;