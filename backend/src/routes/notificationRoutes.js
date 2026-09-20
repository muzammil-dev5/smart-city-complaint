const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    deleteNotification,
    clearAllNotifications
} = require("../controllers/notificationController");

// router.post(
//     "/",
//     authMiddleware,
//     createNotification
// );

router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

router.get(
    "/unread-count",
    authMiddleware,
    getUnreadNotificationCount
);

router.patch(
    "/read-all",
    authMiddleware,
    markAllNotificationsAsRead
);

router.delete(
    "/clear-all",
    authMiddleware,
    clearAllNotifications
);

router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);

router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);


module.exports = router;