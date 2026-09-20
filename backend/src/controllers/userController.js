const User = require("../models/User");
const Department = require("../models/Department");


const getOfficers = async (req, res) => {
    try {
        const { departmentId } = req.query;

        const filter = {
            role: "officer",
            isActive: true
        };

        if (departmentId) {
            filter.department = departmentId;
        }

        const officers = await User.find(filter)
            .select("_id name email department")
            .populate("department", "name");

        return res.status(200).json({
            officers
        });

    } catch (error) {
        console.error("Get officers error:", error);

        return res.status(500).json({
            message: "Server error while fetching officers"
        });
    }
};


const getWorkers = async (req, res) => {
    try {
        const { departmentId, officerId } = req.query;

        const filter = {
            role: "worker",
            isActive: true
        };

        if (departmentId) {
            filter.department = departmentId;
        }

        // Optional:
        // Agar future mein worker ko specific officer ke under
        // assign karna ho to yahan officerId use kar sakte hain.
        // Abhi sirf department filtering hogi.

        const workers = await User.find(filter)
            .select("_id name email department")
            .populate("department", "name");

        return res.status(200).json({
            workers
        });

    } catch (error) {
        console.error("Get workers error:", error);

        return res.status(500).json({
            message: "Server error while fetching workers"
        });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .populate("department", "name description")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);

        return res.status(500).json({
            message: "Server error while fetching users"
        });
    }
};


const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = [
            "citizen",
            "officer",
            "worker",
            "admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = role;

        // Citizen/Admin ko department ki zaroorat nahi
        if (role === "citizen" || role === "admin") {
            user.department = null;
        }

        await user.save();

        const updatedUser = await User.findById(id)
            .select("-password")
            .populate("department", "name description");

        return res.status(200).json({
            message: "User role updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update user role error:", error);

        return res.status(500).json({
            message: "Server error while updating user role"
        });
    }
};


const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be a boolean"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = isActive;

        await user.save();

        const updatedUser = await User.findById(id)
            .select("-password")
            .populate("department", "name description");

        return res.status(200).json({
            message: `User ${isActive ? "activated" : "deactivated"} successfully`,
            user: updatedUser
        });

    } catch (error) {
        console.error("Update user status error:", error);

        return res.status(500).json({
            message: "Server error while updating user status"
        });
    }
};


const updateUserDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { departmentId } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Department sirf officer/worker ko assign hoga
        if (!["officer", "worker"].includes(user.role)) {
            return res.status(400).json({
                message: "Department can only be assigned to officers and workers"
            });
        }

        if (!departmentId) {
            return res.status(400).json({
                message: "Department is required"
            });
        }

        const department = await Department.findOne({
            _id: departmentId,
            isActive: true
        });

        if (!department) {
            return res.status(404).json({
                message: "Active department not found"
            });
        }

        user.department = departmentId;

        await user.save();

        const updatedUser = await User.findById(id)
            .select("-password")
            .populate("department", "name description");

        return res.status(200).json({
            message: "User department updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update user department error:", error);

        return res.status(500).json({
            message: "Server error while updating user department"
        });
    }
};


module.exports = {
    getOfficers,
    getWorkers,
    getAllUsers,
    updateUserRole,
    updateUserStatus,
    updateUserDepartment
};