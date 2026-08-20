const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    getActiveDepartments
} = require("../controllers/departmentController");


router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createDepartment
);


router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getAllDepartments
);

router.get(
    "/active",
    authMiddleware,
    getActiveDepartments
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateDepartment
);


module.exports = router;