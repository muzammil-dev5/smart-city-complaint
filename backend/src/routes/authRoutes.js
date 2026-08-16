const express = require("express");

const router = express.Router();

const roleMiddleware = require("../middleware/roleMiddleware");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser);

router.get(
    "/me",
    authMiddleware,
    (req, res) => {
        res.status(200).json({
            message: "Authentication successful",
            user: req.user
        });
    }
);

router.get(
    "/citizen-test",
    authMiddleware,
    roleMiddleware("citizen"),
    (req, res) => {
        res.status(200).json({
            message: "Citizen access granted",
            user: req.user
        });
    }
);

router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Admin access granted",
            user: req.user
        });
    }
);


module.exports = router;