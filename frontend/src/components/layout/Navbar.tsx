import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.scss";

import {
    getMyNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from "../../services/notificationService";

import type { Notification } from "../../services/notificationService";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LogoutOutlinedIcon from "@mui/icons-material/Logout";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";

interface User {
    name: string;
    role: string;
}

const Navbar = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [notificationAnchor, setNotificationAnchor] =
        useState<null | HTMLElement>(null);

    const notificationOpen = Boolean(notificationAnchor);

    const storedUser = localStorage.getItem("user");

    const user: User | null = storedUser
        ? JSON.parse(storedUser)
        : null;

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const [
                    notificationsResponse,
                    unreadResponse
                ] = await Promise.all([
                    getMyNotifications(),
                    getUnreadNotificationCount()
                ]);

                setNotifications(
                    notificationsResponse.notifications
                );

                setUnreadCount(
                    unreadResponse.count
                );

            } catch (error) {
                console.error(
                    "Failed to fetch notifications:",
                    error
                );
            }
        };

        fetchNotifications();

        const interval = setInterval(
            fetchNotifications,
            10000
        );

        return () => clearInterval(interval);

    }, []);

    const handleNotificationOpen = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const getNotificationIcon = (
        type: Notification["type"]
    ) => {
        switch (type) {
            case "complaint_created":
                return (
                    <AssignmentOutlinedIcon fontSize="small" />
                );

            case "complaint_assigned":
                return (
                    <PersonAddAltOutlinedIcon fontSize="small" />
                );

            case "complaint_started":
                return (
                    <PlayArrowIcon fontSize="small" />
                );

            case "worker_assigned":
                return (
                    <EngineeringOutlinedIcon fontSize="small" />
                );

            case "complaint_resolved":
                return (
                    // <CheckCircleOutlineIcon fontSize="small" />
                    <EngineeringOutlinedIcon fontSize="small" />

                );

            case "feedback_requested":
                return (
                    <StarBorderOutlinedIcon fontSize="small" />
                );

            default:
                return (
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                );
        }
    };

    const handleNotificationClick = async (
        notification: Notification
    ) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(
                    notification._id
                );

                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id
                            ? {
                                ...item,
                                isRead: true
                            }
                            : item
                    )
                );

                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );
            }

            handleNotificationClose();

            const complaintId =
                typeof notification.complaint === "string"
                    ? notification.complaint
                    : notification.complaint?._id;

            if (!complaintId) {
                return;
            }

            const storedUser =
                localStorage.getItem("user");

            const user = storedUser
                ? JSON.parse(storedUser)
                : null;

            if (user?.role === "citizen") {
                navigate(
                    `/citizen/complaints/${complaintId}`
                );
            } else if (user?.role === "officer") {
                navigate(
                    `/officer/complaints/${complaintId}`
                );
            } else if (user?.role === "worker") {
                navigate(
                    `/worker/complaint/${complaintId}`
                );
            } else if (user?.role === "admin") {
                navigate("/admin/complaints");
            }

        } catch (error) {
            console.error(
                "Failed to handle notification:",
                error
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );

            setUnreadCount(0);

        } catch (error) {
            console.error(
                "Failed to mark all notifications:",
                error
            );
        }
    };

    return (
        <Box className="Navbar">

            {/* ================= BRAND ================= */}
            <Box className="navbar-brand">

                <Box className="brand-icon">
                    <LocationCityOutlinedIcon />
                </Box>

                <Box className="brand-content">
                    <Typography className="brand-title">
                        Smart City
                    </Typography>

                    <Typography className="brand-subtitle">
                        Complaint Management
                    </Typography>
                </Box>

            </Box>


            {/* ================= RIGHT SECTION ================= */}
            <Box className="navbar-user">

                {/* Notification */}
                <IconButton
                    className="notification-btn"
                    onClick={handleNotificationOpen}
                    aria-label="Notifications"
                >
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        max={99}
                        invisible={unreadCount === 0}
                        className="notification-badge"
                    >
                        <NotificationsNoneOutlinedIcon />
                    </Badge>
                </IconButton>


                {/* Divider */}
                <Divider
                    orientation="vertical"
                    flexItem
                    className="navbar-divider"
                />


                {/* User Profile */}
                <Box
                    className="user-profile"
                    onClick={() => navigate("/profile")}>

                    <Avatar className="user-avatar">
                        {user?.name
                            ?.charAt(0)
                            .toUpperCase() ?? "G"}
                    </Avatar>

                    <Box className="user-info">

                        <Typography className="user-name">
                            {user?.name ?? "Guest"}
                        </Typography>

                        <Typography className="user-role">
                            {user?.role ?? "Guest"}
                        </Typography>

                    </Box>

                </Box>


                {/* Logout */}
                <Button
                    className="logout-btn"
                    variant="outlined"
                    onClick={logout}
                    startIcon={
                        <LogoutOutlinedIcon />
                    }
                >
                    <span className="logout-text">
                        Logout
                    </span>
                </Button>

            </Box>


            {/* ================= NOTIFICATIONS MENU ================= */}
            <Menu
                anchorEl={notificationAnchor}
                open={notificationOpen}
                onClose={handleNotificationClose}
                className="notification-menu"
                slotProps={{
                    paper: {
                        sx: {
                            width: {
                                xs: "calc(100vw - 24px)",
                                sm: 390
                            },
                            maxWidth:
                                "calc(100vw - 24px)",
                            maxHeight: {
                                xs: "70vh",
                                sm: 500
                            },
                            mt: 1,
                            overflowY: "auto",
                            borderRadius: "14px",
                            border: "1px solid #e2e8f0",
                            boxShadow:
                                "0 15px 40px rgba(15, 23, 42, 0.16)"
                        }
                    }
                }}
            >

                {/* Notification Header */}
                <Box className="notification-header">

                    <Box>
                        <Typography className="notification-title">
                            Notifications
                        </Typography>

                        <Typography className="notification-subtitle">
                            Stay updated with your complaints
                        </Typography>
                    </Box>

                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={
                                handleMarkAllAsRead
                            }
                            className="mark-read-btn"
                        >
                            Mark all read
                        </Button>
                    )}

                </Box>

                <Divider />


                {/* Empty State */}
                {notifications.length === 0 ? (

                    <Box className="notification-empty">

                        <Box className="empty-icon">
                            <NotificationsNoneOutlinedIcon />
                        </Box>

                        <Typography className="empty-title">
                            No notifications
                        </Typography>

                        <Typography className="empty-text">
                            You're all caught up!
                        </Typography>

                    </Box>

                ) : (

                    /* Notification List */
                    notifications.map(
                        (notification) => (

                            <MenuItem
                                key={
                                    notification._id
                                }
                                onClick={() =>
                                    handleNotificationClick(
                                        notification
                                    )
                                }
                                className={
                                    notification.isRead
                                        ? "notification-item read"
                                        : "notification-item unread"
                                }
                            >

                                <Box className="notification-item-content">

                                    <Box
                                        className={
                                            notification.isRead
                                                ? "notification-icon read"
                                                : "notification-icon unread"
                                        }
                                    >
                                        {getNotificationIcon(
                                            notification.type
                                        )}
                                    </Box>

                                    <Box className="notification-message">

                                        <Typography
                                            className={
                                                notification.isRead
                                                    ? "notification-message-text read"
                                                    : "notification-message-text"
                                            }
                                        >
                                            {
                                                notification.message
                                            }
                                        </Typography>

                                        <Typography className="notification-time">
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString()}
                                        </Typography>

                                    </Box>

                                    {!notification.isRead && (
                                        <Box className="unread-dot" />
                                    )}

                                </Box>

                            </MenuItem>

                        )
                    )
                )}

            </Menu>

        </Box>
    );
};

export default Navbar;