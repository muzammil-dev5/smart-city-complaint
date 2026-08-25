import { Badge, Box, Button, Divider, IconButton, Menu, MenuItem, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.scss";
import { getMyNotifications, getUnreadNotificationCount, markAllNotificationsAsRead, markNotificationAsRead } from "../../services/notificationService";
import type { Notification } from "../../services/notificationService";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface User {
    name: string;
    role: string;
}
const Navbar = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
    const notificationOpen = Boolean(notificationAnchor);


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

                setUnreadCount(unreadResponse.count);

            } catch (error) {
                console.error(
                    "Failed to fetch notifications:",
                    error
                );
            }
        };

        fetchNotifications();
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
                return <AssignmentOutlinedIcon fontSize="small" />;

            case "complaint_assigned":
                return <PersonAddAltOutlinedIcon fontSize="small" />;

            case "complaint_started":
                return <PlayArrowIcon fontSize="small" />;

            case "worker_assigned":
                return <EngineeringOutlinedIcon fontSize="small" />;

            case "complaint_resolved":
                return <CheckCircleIcon fontSize="small" />;

            case "feedback_requested":
                return <StarBorderOutlinedIcon fontSize="small" />;

            default:
                return <NotificationsIcon fontSize="small" />;
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
                            ? { ...item, isRead: true }
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

    const storedUser = localStorage.getItem("user");

    const user: User | null = storedUser
        ? JSON.parse(storedUser)
        : null;


    return (
        <Box className="Navbar">
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

                <IconButton
                    color="inherit"
                    onClick={handleNotificationOpen}
                >
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        max={99}
                        invisible={unreadCount === 0}>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <Menu
                    anchorEl={notificationAnchor}
                    open={notificationOpen}
                    onClose={handleNotificationClose}
                    slotProps={{
                        paper: {
                            sx: {
                                width: {
                                    xs: "calc(100vw - 24px)",
                                    sm: 380
                                },
                                maxWidth: "calc(100vw - 24px)",
                                maxHeight: {
                                    xs: "70vh",
                                    sm: 500
                                },
                                mt: 1,
                                overflowY: "auto"
                            }
                        }
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 2,
                            py: 1.5
                        }}>
                        <Typography variant="h6">
                            Notifications
                        </Typography>

                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Box>

                    <Divider />

                    {notifications.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                px: 2,
                                textAlign: "center"
                            }}
                        >
                            <NotificationsIcon
                                sx={{
                                    fontSize: 48,
                                    color: "text.disabled",
                                    mb: 1
                                }}
                            />

                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}>
                                No notifications
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                You're all caught up!
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification) => {
                            console.log(notification.type);
                            return (
                                <MenuItem
                                    key={notification._id}
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    sx={{
                                        whiteSpace: "normal",
                                        alignItems: "flex-start",
                                        py: 1.5,
                                        px: 2,

                                        borderLeft: "3px solid",
                                        borderColor: notification.isRead
                                            ? "transparent"
                                            : "#3b82f6",

                                        backgroundColor: notification.isRead
                                            ? "transparent"
                                            : "action.hover",

                                        opacity: notification.isRead ? 0.75 : 1,

                                        "&:hover": {
                                            backgroundColor: "action.selected"
                                        }
                                    }}>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            width: "100%",
                                            alignItems: "flex-start"
                                        }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mt: 0.3,
                                                minWidth: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                color: notification.isRead
                                                    ? "text.secondary"
                                                    : "#3b82f6",
                                                backgroundColor: notification.isRead
                                                    ? "action.hover"
                                                    : "primary.50"
                                            }}>
                                            {getNotificationIcon(notification.type)}
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: notification.isRead
                                                        ? 400
                                                        : 600
                                                }}>
                                                {notification.message}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            )
                        }

                        )
                    )}
                </Menu>

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