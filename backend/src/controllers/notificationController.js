const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        })
            .populate(
                "complaint",
                "title status"
            )
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
            message: "Server error"
        });
    }
};


const markNotificationAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOne({
                _id: req.params.id,
                user: req.user.id
            });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            message: "Notification marked as read"
        });

    } catch (error) {
        console.error(
            "Mark notification error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getMyNotifications,
    markNotificationAsRead
};