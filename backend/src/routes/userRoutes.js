const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getOfficers, getAllUsers, updateUserRole, updateUserStatus } = require("../controllers/userController.js");


router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
)

router.get(
    "/officers",
    authMiddleware,
    roleMiddleware("admin"),
    getOfficers
)

router.put(
    "/:id/role",
    authMiddleware,
    roleMiddleware("admin"),
    updateUserRole
)

router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    updateUserStatus
)


module.exports = router;
