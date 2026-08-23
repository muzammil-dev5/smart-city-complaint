const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
    try {
        const {
            recipient,
            complaint,
            type,
            message
        } = req.body;

        if (!recipient || !type || !message) {
            return res.status(400).json({
                message: "Recipient, type and message are required"
            });
        }

        const notification = await Notification.create({
            recipient,
            complaint: complaint || null,
            type,
            message
        });

        return res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        console.error(
            "Create notification error:",
            error
        );

        return res.status(500).json({
            message: "Server error while creating notification"
        });
    }
};


// Get My Notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.id
        })
            .populate("complaint","title status")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            notifications
        });

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        return res.status(500).json({
            message: "Server error while fetching notifications"
        });
    }
};


const markNotificationAsRead = async (req, res) => {
    try {
        const notification = 
        await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error(
            "Mark notification as read error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user.id,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        return res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error(
            "Mark all notifications as read error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false
        });

        return res.status(200).json({
            count
        });

    } catch (error) {
        console.error(
            "Get unread notification count error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
};