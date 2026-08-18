const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    getAssignedComplaints,
    assignComplaint,
    getAllComplaints,
    updateComplaintStatus,
    getAssignedComplaintById
} = require("../controllers/complaintController");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("citizen"),
    createComplaint
);

router.get(
    "/my",
    authMiddleware,
    roleMiddleware("citizen"),
    getMyComplaints
);

router.get(
    "/assigned",
    authMiddleware,
    roleMiddleware("officer"),
    getAssignedComplaints
)

router.get(
    "/all",
    authMiddleware,
    roleMiddleware("admin"),
    getAllComplaints
)

router.get(
    "/:id",
    authMiddleware,
    getComplaintById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("citizen"),
    updateComplaint
);


router.get(
    "/assigned/:id",
    authMiddleware,
    roleMiddleware("officer"),
    getAssignedComplaintById
);

router.put(
    "/:id/assign",
    authMiddleware,
    roleMiddleware("admin"),
    assignComplaint
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("officer"),
    updateComplaintStatus
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("citizen"),
    deleteComplaint
)




module.exports = router;
