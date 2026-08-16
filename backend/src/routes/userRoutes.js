const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getOfficers } = require("../controllers/userController.js");

router.get(
    "/officers",
    authMiddleware,
    roleMiddleware("admin"),
    getOfficers
)


module.exports = router;

