const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getMyNotifications, markNotificationAsRead
} = require("../controllers/notificationController");


router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);


module.exports = router;