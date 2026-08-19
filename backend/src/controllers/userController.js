const User = require("../models/User");

const getOfficers = async (req, res) => {
    try {
        const officers = await User.find({
            role: "officer"
        }).select("_id name email");

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

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        return res.status(200).json({
            users
        });
    }
    catch (error) {
        console.error("Get all users error:", error);

        return res.status(500).json({
            message: "Server error while fetching users"
        })
    }
}


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
        await user.save();
        return res.status(200).json({
            message: "User role updated successfully",
            user
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
            return res.status(400).json({ message: "isActive must be a boolean" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = isActive;

        await user.save();

        return res.status(200).json({
            message: `User ${isActive ? "activated" : "deactivated"} successfully`,
            user
        });

    } catch (error) {
        console.error("Update user status error:", error);

        return res.status(500).json({
            message: "Server error while updating user status"
        });
    }
};

const getWorkers = async (req, res) => {
    try {
        const workers = await User.find({
            role: "worker"
        }).select("_id name email");

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

module.exports = {
    getOfficers,
    getAllUsers,
    updateUserRole,
    updateUserStatus,
    getWorkers
};