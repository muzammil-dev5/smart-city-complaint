const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

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
    getAssignedComplaintById,
    getWorkerComplaints,
    assignWorker,
    getWorkerComplaintById,
    updateWorkerComplaintStatus,
    getComplaintAnalytics,
    getComplaintActivities
} = require("../controllers/complaintController");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("citizen"),
    upload.array("images", 5),
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
    "/worker",
    authMiddleware,
    roleMiddleware("worker"),
    getWorkerComplaints
);

router.get(
    "/all",
    authMiddleware,
    roleMiddleware("admin"),
    getAllComplaints
)

router.get(
    "/analytics",
    authMiddleware,
    roleMiddleware("admin"),
    getComplaintAnalytics
);

router.get(
    "/:id",
    authMiddleware,
    getComplaintById
);

router.get(
    "/:id/activities",
    authMiddleware,
    getComplaintActivities
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

router.get(
    "/worker/:id",
    authMiddleware,
    roleMiddleware("worker"),
    getWorkerComplaintById
);

router.put(
    "/:id/assign",
    authMiddleware,
    roleMiddleware("admin"),
    assignComplaint
);

router.put(
    "/:id/assign-worker",
    authMiddleware,
    roleMiddleware("admin"),
    assignWorker
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("officer"),
    updateComplaintStatus
);

router.patch(
    "/worker/:id/status",
    authMiddleware,
    roleMiddleware("worker"),
    updateWorkerComplaintStatus
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("citizen"),
    deleteComplaint
)




module.exports = router;
