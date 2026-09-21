import { Box, Paper, Typography, CircularProgress, } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState, } from "react";
import gsap from "gsap";
import { getComplaintAnalytics } from "../../services/complaintService";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import RecentUsers from "./RecentUsers";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);

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

    const dashboardRef = useRef<HTMLDivElement | null>(null);

    const headerRef = useRef<HTMLDivElement | null>(null);

    const chartsRef = useRef<HTMLDivElement | null>(null);

    const analyticsRef = useRef<HTMLDivElement | null>(null);

    const recentUsersRef = useRef<HTMLDivElement | null>(null);

    // ================= FETCH DASHBOARD DATA =================

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const analyticsResponse =
                    await getComplaintAnalytics();

                setAnalytics(
                    analyticsResponse.analytics
                );
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

    // ================= GSAP ANIMATION =================

    useLayoutEffect(() => {
        if (loading) return;

        if (
            !dashboardRef.current ||
            !headerRef.current ||
            !chartsRef.current ||
            !analyticsRef.current ||
            !recentUsersRef.current
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

            // Header
            gsap.set(headerRef.current, {
                opacity: 0,
                y: 25,
            });

            // Analytics Cards
            gsap.set(analyticsCards, {
                opacity: 0,
                y: 25,
            });

            // Charts
            gsap.set(chartCards, {
                opacity: 0,
                x: 25,
            });

            // Recent Users
            gsap.set(recentUsersRef.current, {
                opacity: 0,
                y: 25,
            });

            // Header animation
            timeline.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.45,
            });

            // Analytics animation
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

            // Charts animation
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

            // Recent users animation
            timeline.to(
                recentUsersRef.current,
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

    // ================= LOADING =================

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

    // ================= ANALYTICS CARDS =================

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

    // ================= UI =================

    return (
        <Box
            ref={dashboardRef}
            className="adminDashboard-page"
        >
            <Box className="adminDashboard-mainGrid">

                {/* ================================================= */}
                {/* LEFT SIDE */}
                {/* ================================================= */}

                <Box className="adminDashboard-left">

                    {/* ================= DASHBOARD HEADER ================= */}

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

                    {/* ================= ANALYTICS CARDS ================= */}

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

                    {/* ================= RECENT USERS ================= */}

                    <Box
                        ref={recentUsersRef}
                        className="adminDashboard-recentUsers"
                    >
                        <RecentUsers />
                    </Box>

                </Box>

                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                <Box
                    ref={chartsRef}
                    className="adminDashboard-right"
                >

                    {/* ================= CATEGORY BAR CHART ================= */}

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
                                height={270}
                                sx={{
                                    width: "100%",
                                }}
                            />

                        </Box>
                    </Paper>

                    {/* ================= STATUS PIE CHART ================= */}

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
                                                value:
                                                    analytics.pending,
                                                label: "Pending",
                                            },
                                            {
                                                id: 1,
                                                value:
                                                    analytics.assigned,
                                                label: "Assigned",
                                            },
                                            {
                                                id: 2,
                                                value:
                                                    analytics.inProgress,
                                                label: "In Progress",
                                            },
                                            {
                                                id: 3,
                                                value:
                                                    analytics.resolved,
                                                label: "Resolved",
                                            },
                                            {
                                                id: 4,
                                                value:
                                                    analytics.rejected,
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