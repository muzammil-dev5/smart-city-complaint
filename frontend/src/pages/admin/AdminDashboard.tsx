import { Box, MenuItem, Paper, TextField, Typography, Select, InputLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import { getAllComplaints, getComplaintAnalytics } from "../../services/complaintService";
import UserTable from "../../components/Table/UserTable";
import { getAllUsers } from "../../services/userService";
import type { User, Complaint, RoleFilter } from "../../types/user";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [analytics, setAnalytics] = useState({
        total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0, categories: { roadDamage: 0, streetLight: 0, garbageCollection: 0 }
    })
    const [search, setSearch] = useState("");
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())

        const matchesRole =
            roleFilter === "all" ||
            user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

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
                const [complaintsResponse, usersResponse, analyticsResponse] = await Promise.all([
                    getAllComplaints(),
                    getAllUsers(),
                    getComplaintAnalytics()
                ]);

                setComplaints(complaintsResponse.complaints);
                setUsers(usersResponse.users);
                setAnalytics(analyticsResponse.analytics)

            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <>
            {loading ? (<Typography>Loading... </Typography>) : (
                <Box>
                    <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}> Manage the Smart City Complaint Management System.</Typography>

                    {/* <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">  Total Users </Typography>
                            <Typography variant="h4"> {users.length} </Typography>
                        </Paper> */}

                    {/* complaints Analytics Cards */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)"
                            },
                            gap: 2
                        }}>

                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h6">
                                Total Complaints
                            </Typography>
                            <Box
                                sx={{
                                    width: 100, height: 100, borderRadius: 1, color: "#fff", bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >{analytics.total}</Box>
                        </Paper>

                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h6">
                                Pending Complaints
                            </Typography>
                            <Box
                                sx={{
                                    width: 100, height: 100, borderRadius: 1, color: "#fff", bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >{analytics.pending}</Box>
                        </Paper>

                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h6">
                                Assigned Complaints
                            </Typography>
                            <Box
                                sx={{
                                    width: 100, height: 100, borderRadius: 1, color: "#fff", bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >{analytics.assigned}</Box>
                        </Paper>

                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h6">
                                In Progress Complaints
                            </Typography>
                            <Box
                                sx={{
                                    width: 100, height: 100, borderRadius: 1, color: "#fff", bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >{analytics.inProgress}</Box>
                        </Paper>

                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h6">
                                Resolved Complaints
                            </Typography>
                            <Box
                                sx={{
                                    width: 100, height: 100, borderRadius: 1, color: "#fff", bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >{analytics.resolved}</Box>
                        </Paper>

                        <Paper sx={{ p: 3 }} elevation={3}>
                            <Typography variant="h6">
                                Rejected Complaints
                            </Typography>
                            <Box
                                sx={{
                                    width: 100, height: 100, borderRadius: 1, color: "#fff", bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            >{analytics.rejected}</Box>

                        </Paper>
                    </Box >

                    {/* complaints By Ctaegory Bar chart */}

                    < Paper sx={{ p: 3, mt: 3 }
                    }>
                        <Typography variant="h6" gutterBottom>
                            Complaints by Category
                        </Typography>

                        <Box sx={{ width: "100%", overflowX: "auto" }}>
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: [
                                            "Road Damage",
                                            "Street Light",
                                            "Garbage Collection"
                                        ]
                                    }
                                ]}
                                series={[
                                    {
                                        data: [
                                            analytics.categories.roadDamage,
                                            analytics.categories.streetLight,
                                            analytics.categories.garbageCollection
                                        ],
                                        label: "Complaints"
                                    }
                                ]}
                                height={350}
                                sx={{
                                    width: "100%",
                                    minWidth: 400
                                }}
                            />
                        </Box>
                    </ Paper>

                    {/* complaints by status Pie Chart */}

                    < Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Complaints by Status
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                overflowX: "auto"
                            }}
                        >
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            {
                                                id: 0,
                                                value: analytics.pending,
                                                label: "Pending"
                                            },
                                            {
                                                id: 1,
                                                value: analytics.assigned,
                                                label: "Assigned"
                                            },
                                            {
                                                id: 2,
                                                value: analytics.inProgress,
                                                label: "In Progress"
                                            },
                                            {
                                                id: 3,
                                                value: analytics.resolved,
                                                label: "Resolved"
                                            },
                                            {
                                                id: 4,
                                                value: analytics.rejected,
                                                label: "Rejected"
                                            }
                                        ],
                                        innerRadius: 60,
                                        outerRadius: 120,
                                        paddingAngle: 2
                                    }
                                ]}
                                height={350}
                                sx={{
                                    width: "100%",
                                    maxWidth: 500
                                }}
                            />
                        </Box>
                    </Paper >

                    {/* Basic Reports Complain Status and Complain Summary */}
                    < Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, 1fr)"
                            },
                            gap: 2,
                            mt: 3
                        }}>
                        {/* Complaint Statistics */}
                        < Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Complaint Statistics
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, 1fr)"
                                    },
                                    gap: 2,
                                    mt: 2
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Complaints
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.total}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Pending
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.pending}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Assigned
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.assigned}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        In Progress
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.inProgress}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Resolved
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.resolved}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Rejected
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.rejected}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper >

                        {/* Category Summary */}
                        < Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Category Summary
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Road Damage
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.categories.roadDamage}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Street Light
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.categories.streetLight}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Garbage Collection
                                    </Typography>
                                    <Typography variant="h6">
                                        {analytics.categories.garbageCollection}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper >
                    </Box >

                    {/* User Management */}

                    < Box sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(2, 1fr)"
                        }, gap: 2
                    }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h5"
                                sx={{ mt: 4, mb: 2 }}>
                                User Management
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <TextField
                                fullWidth
                                value={search}
                                label="Search Users"
                                placeholder="Search by name or email..."
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Paper>


                        <FormControl sx={{ minWidth: 200, mb: 2 }}>
                            <InputLabel id="role-filter-label">
                                Role
                            </InputLabel>
                            <Select labelId="role-filter-label" value={roleFilter} label="Select Role Filter" onChange={(e) => setRoleFilter(e.target.value)}>
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="citizen">Citizen</MenuItem>
                                <MenuItem value="officer">Officer</MenuItem>
                                <MenuItem value="worker">Worker</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box >

                    <UserTable
                        users={filteredUsers}
                        onRoleUpdated={handleRoleUpdated}
                        onStatusUpdated={handleStatusUpdated}
                        currentUserId={currentUser?.id}
                    />


                    {/* <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, 1fr)"
                            },
                            gap: 2,
                            mt: 3
                        }}
                    >
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom> User Management </Typography>
                            <Typography>Manage citizens, officers and workers. </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Department Management</Typography>
                            <Typography>Manage departments and assignments. </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Complaint Analytics</Typography>
                            <Typography>Monitor complaint trends and performance. </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Reports</Typography>
                            <Typography>View and generate system reports.</Typography>
                        </Paper>

                    </Box> */}
                </Box >

            )}
        </>
    );
}

export default AdminDashboard;