const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createFeedback,
    getComplaintFeedback,
    getAllFeedback
} = require("../controllers/feedbackController");


// Citizen submits feedback
router.post(
    "/",
    authMiddleware,
    roleMiddleware("citizen"),
    createFeedback
);


router.get(
    "/:complaintId",
    authMiddleware,
    getComplaintFeedback
);


router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllFeedback
);


module.exports = router;