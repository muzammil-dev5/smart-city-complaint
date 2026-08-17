import { Box, MenuItem, Paper, TextField, Typography, Select, InputLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import { getAllComplaints } from "../../services/complaintService";
import UserTable from "../../components/Table/UserTable";
import { getAllUsers } from "../../services/userService";
import type { User, Complaint, RoleFilter } from "../../types/user";


const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [search, setSearch] = useState("");
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(complaint => complaint.status === "pending").length;
    const inProgressComplaints = complaints.filter(complaint => complaint.status === "in_progress").length;
    const resolvedComplaints = complaints.filter(complaint => complaint.status === "resolved").length;
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
                const [complaintsResponse, usersResponse] = await Promise.all([
                    getAllComplaints(),
                    getAllUsers()
                ]);

                setComplaints(complaintsResponse.complaints);
                setUsers(usersResponse.users);

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

                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)"
                        }, gap: 2
                    }}>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">  Total Users </Typography>
                            <Typography variant="h4"> {users.length} </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6"> Total Complaints </Typography>
                            <Typography variant="h4"> {totalComplaints} </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6"> Pending Complaints </Typography>
                            <Typography variant="h4"> {pendingComplaints} </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6"> In Progress Complaints </Typography>
                            <Typography variant="h4"> {inProgressComplaints} </Typography>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6"> Resolved Complaints </Typography>
                            <Typography variant="h4"> {resolvedComplaints} </Typography>
                        </Paper>
                    </Box>

                    <Box sx={{
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
                    </Box>

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
                </Box>

            )}
        </>
    );
}

export default AdminDashboard;