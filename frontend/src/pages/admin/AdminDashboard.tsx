
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import gsap from "gsap";

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

    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const chartsRef = useRef<HTMLDivElement | null>(null);
    const analyticsRef = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef<HTMLDivElement | null>(null);

    const filteredUsers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue);

            const matchesRole =
                roleFilter === "all" || user.role === roleFilter;

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

    useLayoutEffect(() => {
        if (loading) return;

        if (
            !dashboardRef.current ||
            !headerRef.current ||
            !chartsRef.current ||
            !analyticsRef.current ||
            !tableRef.current
        ) {
            return;
        }

        const context = gsap.context(() => {
            const analyticsCards =
                analyticsRef.current!.querySelectorAll(
                    ".Analytics-card"
                );

            const chartCards =
                chartsRef.current!.querySelectorAll(
                    ".chart-card"
                );

            const timeline = gsap.timeline({
                defaults: {
                    ease: "power2.out",
                },
            });

            gsap.set(headerRef.current, {
                opacity: 0,
                y: 25,
            });

            gsap.set(analyticsCards, {
                opacity: 0,
                y: 25,
            });

            gsap.set(chartCards, {
                opacity: 0,
                x: 25,
            });

            gsap.set(tableRef.current, {
                opacity: 0,
                y: 25,
            });

            timeline.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.45,
            });

            timeline.to(
                analyticsCards,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.08,
                },
                "-=0.2"
            );

            timeline.to(
                chartCards,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.45,
                    stagger: 0.1,
                },
                "-=0.35"
            );

            timeline.to(
                tableRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                },
                "-=0.15"
            );
        }, dashboardRef);

        return () => {
            context.revert();
        };
    }, [loading]);

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
        <Box
            ref={dashboardRef}
            className="adminDashboard-page"
        >
            <Box className="adminDashboard-mainGrid">

                {/* ================= LEFT SIDE ================= */}

                <Box className="adminDashboard-left">

                    {/* Dashboard Header */}
                    <Box
                        ref={headerRef}
                        className="adminDashboard"
                    >
                        <Box className="adminDashboard-content">
                            <Typography className="adminDashboard-header">
                                Admin Dashboard
                            </Typography>

                            <Typography className="adminDashboard-title">
                                Manage and monitor the Smart City
                                Complaint Management System.
                            </Typography>
                        </Box>

                        <Box className="adminComplaints-count">
                            <Typography className="count-label">
                                Total Complaints
                            </Typography>

                            <Typography className="count-number">
                                {analytics.total}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Analytics Cards */}
                    <Box
                        ref={analyticsRef}
                        className="Analytics-dashboard-card"
                    >
                        {analyticsCards.map((card) => (
                            <Paper
                                elevation={0}
                                key={card.title}
                                className={`Analytics-card ${card.className}`}
                            >
                                <Box className="Analytics-card-content">
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

                    {/* User Management */}
                    <Paper
                        ref={tableRef}
                        className="adminDataTable"
                        elevation={0}
                    >
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
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
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

                {/* ================= RIGHT SIDE ================= */}

                <Box
                    ref={chartsRef}
                    className="adminDashboard-right"
                >
                    {/* Bar Chart */}
                    <Paper
                        elevation={0}
                        className="chart-card bar-chart-card"
                    >
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
                                height={270}
                                sx={{
                                    width: "100%",
                                }}
                            />
                        </Box>
                    </Paper>

                    {/* Pie Chart */}
                    <Paper
                        elevation={0}
                        className="chart-card pie-chart-card"
                    >
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
                                        outerRadius: 92,
                                        innerRadius: 54,
                                        paddingAngle: 2,
                                    },
                                ]}
                                height={280}
                                sx={{
                                    width: "100%",
                                    maxWidth: 450,
                                }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
