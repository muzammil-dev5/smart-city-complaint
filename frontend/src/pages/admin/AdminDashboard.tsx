// import { Box, MenuItem, Paper, TextField, Typography, Select, InputLabel, FormControl } from '@mui/material';
// import { useState, useEffect } from 'react';
// import { getAllComplaints, getComplaintAnalytics } from "../../services/complaintService";
// import UserTable from "../../components/Table/UserTable";
// import { getAllUsers } from "../../services/userService";
// import type { User, Complaint, RoleFilter } from "../../types/user";
// import { BarChart } from "@mui/x-charts/BarChart";
// import { PieChart } from "@mui/x-charts/PieChart";
// import "./AdminDashboard.scss";

// const AdminDashboard = () => {
//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [complaints, setComplaints] = useState<Complaint[]>([]);
//     const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
//     const [analytics, setAnalytics] = useState({
//         total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0, categories: { roadDamage: 0, streetLight: 0, garbageCollection: 0 }
//     })
//     const [search, setSearch] = useState("");
//     const storedUser = localStorage.getItem("user");
//     const currentUser = storedUser ? JSON.parse(storedUser) : null;

//     const filteredUsers = users.filter((user) => {
//         const matchesSearch =
//             user.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
//             user.email.toLowerCase().includes(search.toLowerCase())

//         const matchesRole =
//             roleFilter === "all" ||
//             user.role === roleFilter;

//         return matchesSearch && matchesRole;
//     });

//     const handleRoleUpdated = (
//         userId: string,
//         role: User["role"]
//     ) => {
//         setUsers((currentUsers) =>
//             currentUsers.map((user) =>
//                 user._id === userId
//                     ? { ...user, role }
//                     : user
//             )
//         );
//     };

//     const handleStatusUpdated = (
//         userId: string,
//         isActive: boolean
//     ) => {
//         setUsers((currentUsers) =>
//             currentUsers.map((user) =>
//                 user._id === userId
//                     ? { ...user, isActive }
//                     : user
//             )
//         );
//     };

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 const [complaintsResponse, usersResponse, analyticsResponse] = await Promise.all([
//                     getAllComplaints(),
//                     getAllUsers(),
//                     getComplaintAnalytics()
//                 ]);

//                 setComplaints(complaintsResponse.complaints);
//                 setUsers(usersResponse.users);
//                 setAnalytics(analyticsResponse.analytics)

//             } catch (error) {
//                 console.error("Failed to fetch admin dashboard data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchDashboardData();
//     }, []);

//     return (
//         <>
//             {loading ? (<Typography>Loading... </Typography>) : (
//                 <Box className="AdminDashboard">
//                     {/* Dashboard Header */}
//                     <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
//                     <Typography variant="body1" sx={{ mb: 3 }}> Manage the Smart City Complaint Management System.</Typography>

//                     {/* complaints Analytics Cards */}
//                     <Box className="Analytics-dashboard-card" >
//                         <div className='Analytics-card'>
//                             <Typography className='Analytics-title'>Total Complaints </Typography>
//                             <div className='Analytics-count'>{analytics.total}</div>
//                         </div>

//                         <div className='Analytics-card'>
//                             <Typography className='Analytics-title'>Pending Complaints </Typography>
//                             <div className='Analytics-count'>{analytics.pending}</div>
//                         </div>

//                         <div className='Analytics-card'>
//                             <Typography className='Analytics-title'>Assigned Complaints </Typography>
//                             <div className='Analytics-count'>{analytics.assigned}</div>
//                         </div>

//                         <div className='Analytics-card'>
//                             <Typography className='Analytics-title'>In Progress Complaints </Typography>
//                             <div className='Analytics-count'>{analytics.inProgress}</div>
//                         </div>

//                         <div className='Analytics-card'>
//                             <Typography className='Analytics-title'>Resolved Complaints </Typography>
//                             <div className='Analytics-count'>{analytics.resolved}</div>
//                         </div>

//                         <div className='Analytics-card'>
//                             <Typography className='Analytics-title'>Rejected Complaints </Typography>
//                             <div className='Analytics-count'>{analytics.rejected}</div>
//                         </div>
//                     </Box >

//                     {/* complaints By Ctaegory Bar chart */}
//                     < Paper sx={{ p: 3, mt: 3 }}>
//                         <Typography variant="h6" gutterBottom>Complaints by Category</Typography>
//                         <Box sx={{ width: "100%", overflowX: "auto" }}>
//                             <BarChart
//                                 xAxis={[
//                                     {
//                                         scaleType: "band",
//                                         data: [
//                                             "Road Damage",
//                                             "Street Light",
//                                             "Garbage Collection"
//                                         ]
//                                     }
//                                 ]}
//                                 series={[
//                                     {
//                                         data: [
//                                             analytics.categories.roadDamage,
//                                             analytics.categories.streetLight,
//                                             analytics.categories.garbageCollection
//                                         ],
//                                         label: "Complaints"
//                                     }
//                                 ]}
//                                 height={350}
//                                 sx={{ width: "100%", minWidth: 400 }}
//                             />
//                         </Box>
//                     </ Paper>

//                     {/* complaints by status Pie Chart */}
//                     < Paper sx={{ p: 3, mt: 3 }}>
//                         <Typography variant="h6" gutterBottom>Complaints by Status</Typography>

//                         <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
//                             <PieChart
//                                 series={[
//                                     {
//                                         data: [
//                                             {
//                                                 id: 0,
//                                                 value: analytics.pending,
//                                                 label: "Pending"
//                                             },
//                                             {
//                                                 id: 1,
//                                                 value: analytics.assigned,
//                                                 label: "Assigned"
//                                             },
//                                             {
//                                                 id: 2,
//                                                 value: analytics.inProgress,
//                                                 label: "In Progress"
//                                             },
//                                             {
//                                                 id: 3,
//                                                 value: analytics.resolved,
//                                                 label: "Resolved"
//                                             },
//                                             {
//                                                 id: 4,
//                                                 value: analytics.rejected,
//                                                 label: "Rejected"
//                                             }
//                                         ],
//                                         innerRadius: 60,
//                                         outerRadius: 120,
//                                         paddingAngle: 2
//                                     }
//                                 ]}
//                                 height={350}
//                                 sx={{ width: "100%", maxWidth: 500 }} />
//                         </Box>
//                     </Paper >

//                     {/* Basic Reports Complain Status and Complain Summary */}
//                     < Box
//                         sx={{
//                             display: "grid",
//                             gridTemplateColumns: {
//                                 xs: "1fr",
//                                 md: "repeat(2, 1fr)"
//                             },
//                             gap: 2,
//                             mt: 3
//                         }}>
//                         {/* Complaint Statistics */}
//                         < Paper sx={{ p: 3 }}>
//                             <Typography variant="h6" gutterBottom>Complaint Statistics</Typography>
//                             <Box
//                                 sx={{
//                                     display: "grid",
//                                     gridTemplateColumns: {
//                                         xs: "1fr",
//                                         sm: "repeat(2, 1fr)"
//                                     },
//                                     gap: 2, mt: 2
//                                 }}>
//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Total Complaints</Typography>
//                                     <Typography variant="h6">{analytics.total}</Typography>
//                                 </Box>

//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Pending</Typography>
//                                     <Typography variant="h6">{analytics.pending}</Typography>
//                                 </Box>

//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Assigned</Typography>
//                                     <Typography variant="h6">{analytics.assigned}</Typography>
//                                 </Box>

//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">In Progress</Typography>
//                                     <Typography variant="h6">{analytics.inProgress}</Typography>
//                                 </Box>

//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Resolved</Typography>
//                                     <Typography variant="h6">{analytics.resolved}</Typography>
//                                 </Box>

//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Rejected</Typography>
//                                     <Typography variant="h6">{analytics.rejected}</Typography>
//                                 </Box>
//                             </Box>
//                         </Paper >

//                         {/* Category Summary */}
//                         < Paper sx={{ p: 3 }}>
//                             <Typography variant="h6" gutterBottom> Category Summary</Typography>

//                             <Box sx={{ mt: 2 }}>
//                                 <Box sx={{ mb: 2 }}>
//                                     <Typography variant="body2" color="text.secondary">Road Damage</Typography>
//                                     <Typography variant="h6">{analytics.categories.roadDamage}</Typography>
//                                 </Box>

//                                 <Box sx={{ mb: 2 }}>
//                                     <Typography variant="body2" color="text.secondary">Street Light</Typography>
//                                     <Typography variant="h6">{analytics.categories.streetLight}</Typography>
//                                 </Box>

//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Garbage Collection</Typography>
//                                     <Typography variant="h6">{analytics.categories.garbageCollection}</Typography>
//                                 </Box>
//                             </Box>
//                         </Paper >
//                     </Box >

//                     {/* User Management */}
//                     < Box sx={{
//                         display: "grid",
//                         marginTop: "20px",
//                         gridTemplateColumns: {
//                             xs: "1fr",
//                             sm: "repeat(2, 1fr)",
//                             md: "repeat(2, 1fr)"
//                         }, gap: 2
//                     }}>
//                         <Paper sx={{ p: 3 }}>
//                             <Typography variant="h5" sx={{ mt: 2, mb: 2 }}> User Management </Typography>
//                         </Paper>

//                         <Paper sx={{ p: 3 }}>
//                             <TextField
//                                 fullWidth
//                                 value={search}
//                                 label="Search Users"
//                                 placeholder="Search by name or email..."
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                         </Paper>

//                         <FormControl sx={{ minWidth: 200, mb: 2 }}>
//                             <InputLabel id="role-filter-label">
//                                 Role
//                             </InputLabel>
//                             <Select labelId="role-filter-label" value={roleFilter} label="Select Role Filter" onChange={(e) => setRoleFilter(e.target.value)}>
//                                 <MenuItem value="all">All Roles</MenuItem>
//                                 <MenuItem value="citizen">Citizen</MenuItem>
//                                 <MenuItem value="officer">Officer</MenuItem>
//                                 <MenuItem value="worker">Worker</MenuItem>
//                                 <MenuItem value="admin">Admin</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Box >

//                     {/* User Data Table */}
//                     <UserTable
//                         users={filteredUsers}
//                         onRoleUpdated={handleRoleUpdated}
//                         onStatusUpdated={handleStatusUpdated}
//                         currentUserId={currentUser?.id}
//                     />

//                 </Box >
//             )}
//         </>
//     );
// }

// export default AdminDashboard;



import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
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

    /*
     * Filter users
     */
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

    /*
     * Update user role locally after successful API update
     */
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

    /*
     * Update user active status locally
     */
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

    /*
     * Fetch dashboard data
     */
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
                console.error(
                    "Failed to fetch admin dashboard data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    /*
     * Loading state
     */
    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <CircularProgress />
                    <Typography color="text.secondary">
                        Loading dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    /*
     * Analytics cards
     */
    const analyticsCards = [
        {
            title: "Total Complaints",
            value: analytics.total,
            className: "total",
        },
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
        <Box
            className="AdminDashboard"
            sx={{
                width: "100%",
                pb: 4,
            }}
        >
            {/* =====================================================
                DASHBOARD HEADER
            ====================================================== */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                    }}
                >
                    Admin Dashboard
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Manage and monitor the Smart City Complaint
                    Management System.
                </Typography>
            </Box>

            {/* =====================================================
                COMPLAINT OVERVIEW
            ====================================================== */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    Complaint Overview
                </Typography>

                <Box
                    className="Analytics-dashboard-card"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(6, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {analyticsCards.map((card) => (
                        <Paper
                            key={card.title}
                            className={`Analytics-card ${card.className}`}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                        "0 6px 18px rgba(0,0,0,0.08)",
                                },
                            }}
                        >
                            <Typography
                                className="Analytics-title"
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontWeight: 500,
                                    mb: 1,
                                }}
                            >
                                {card.title}
                            </Typography>

                            <Typography
                                className="Analytics-count"
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {card.value}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* =====================================================
                COMPLAINT ANALYTICS
            ====================================================== */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    Complaint Analytics
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "repeat(2, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {/* Category Chart */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            Complaints by Category
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Distribution of complaints across
                            different categories.
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                overflowX: "auto",
                            }}
                        >
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
                                            analytics.categories
                                                .roadDamage,
                                            analytics.categories
                                                .streetLight,
                                            analytics.categories
                                                .garbageCollection,
                                        ],
                                        label: "Complaints",
                                    },
                                ]}
                                height={320}
                                sx={{
                                    width: "100%",
                                    minWidth: 400,
                                }}
                            />
                        </Box>
                    </Paper>

                    {/* Status Chart */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            Complaints by Status
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Current status distribution of all
                            complaints.
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                minHeight: 320,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflowX: "auto",
                            }}
                        >
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
                                        innerRadius: 65,
                                        outerRadius: 115,
                                        paddingAngle: 2,
                                    },
                                ]}
                                height={320}
                                sx={{
                                    width: "100%",
                                    maxWidth: 500,
                                }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* =====================================================
                COMPLAINT SUMMARY
            ====================================================== */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    Complaint Summary
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {/* Complaint Statistics */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 3,
                            }}
                        >
                            Complaint Statistics
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            <SummaryItem
                                label="Total Complaints"
                                value={analytics.total}
                            />

                            <SummaryItem
                                label="Pending"
                                value={analytics.pending}
                            />

                            <SummaryItem
                                label="Assigned"
                                value={analytics.assigned}
                            />

                            <SummaryItem
                                label="In Progress"
                                value={analytics.inProgress}
                            />

                            <SummaryItem
                                label="Resolved"
                                value={analytics.resolved}
                            />

                            <SummaryItem
                                label="Rejected"
                                value={analytics.rejected}
                            />
                        </Box>
                    </Paper>

                    {/* Category Summary */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 3,
                            }}
                        >
                            Category Summary
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <CategorySummaryItem
                                label="Road Damage"
                                value={
                                    analytics.categories.roadDamage
                                }
                                total={analytics.total}
                            />

                            <CategorySummaryItem
                                label="Street Light"
                                value={
                                    analytics.categories.streetLight
                                }
                                total={analytics.total}
                            />

                            <CategorySummaryItem
                                label="Garbage Collection"
                                value={
                                    analytics.categories
                                        .garbageCollection
                                }
                                total={analytics.total}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* =====================================================
                USER MANAGEMENT
            ====================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                    },
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                {/* User Management Header */}

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            mb: 0.5,
                        }}
                    >
                        User Management
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage citizens, officers, workers and
                        administrators.
                    </Typography>
                </Box>

                {/* User Filters */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(0, 1fr) 220px",
                        },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <TextField
                        fullWidth
                        value={search}
                        label="Search Users"
                        placeholder="Search by name or email..."
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <FormControl fullWidth>
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
                            }
                        >
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

                {/* User Table */}

                <UserTable
                    users={filteredUsers}
                    onRoleUpdated={handleRoleUpdated}
                    onStatusUpdated={handleStatusUpdated}
                    currentUserId={
                        currentUser?._id ?? currentUser?.id
                    }
                />
            </Paper>
        </Box>
    );
};

/*
 * Reusable summary item
 */
type SummaryItemProps = {
    label: string;
    value: number;
};

const SummaryItem = ({
    label,
    value,
}: SummaryItemProps) => {
    return (
        <Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
            >
                {label}
            </Typography>

            <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
            >
                {value}
            </Typography>
        </Box>
    );
};

/*
 * Reusable category summary
 */
type CategorySummaryItemProps = {
    label: string;
    value: number;
    total: number;
};

const CategorySummaryItem = ({
    label,
    value,
    total,
}: CategorySummaryItemProps) => {
    const percentage =
        total > 0
            ? Math.round((value / total) * 100)
            : 0;

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.75,
                }}
            >
                <Typography variant="body2">
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                >
                    {value} ({percentage}%)
                </Typography>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    height: 7,
                    borderRadius: 10,
                    backgroundColor: "action.hover",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: `${percentage}%`,
                        height: "100%",
                        borderRadius: 10,
                        backgroundColor: "primary.main",
                        transition: "width 0.3s ease",
                    }}
                />
            </Box>
        </Box>
    );
};

export default AdminDashboard;