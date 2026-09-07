const express = require("express");

const router = express.Router();

const roleMiddleware = require("../middleware/roleMiddleware");

const {
    registerUser,
    loginUser,
    getMyProfile,
    updateMyProfile,
    changePassword,
} = require("../controllers/authController");

const authMiddleware =
    require("../middleware/authMiddleware");


// ================= AUTH =================

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);


// ================= PROFILE =================

router.get(
    "/me",
    authMiddleware,
    getMyProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateMyProfile
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


// ================= TEST ROUTES =================

router.get(
    "/citizen-test",
    authMiddleware,
    roleMiddleware("citizen"),
    (req, res) => {
        res.status(200).json({
            message: "Citizen access granted",
            user: req.user,
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
            user: req.user,
        });
    }
);


module.exports = router;