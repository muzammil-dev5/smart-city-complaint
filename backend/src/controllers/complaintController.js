const Complaint = require("../models/Complaint");
const User = require("../models/User");

const createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            department,
            images
        } = req.body;

        if (!title || !description || !category || !location?.address) {
            return res.status(400).json({
                message: "Please provide all required complaint details"
            });
        }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            location,
            department: department || null,
            images: images || [],
            citizen: req.user.id,

            statusHistory: [
                {
                    status: "pending",
                    changedAt: new Date()
                }
            ]
        });

        return res.status(201).json({
            message: "Complaint created successfully",
            complaint
        });

    } catch (error) {
        console.error("Create complaint error:", error);

        return res.status(500).json({
            message: "Server error while creating complaint"
        });
    }
};

const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            citizen: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Complaints fetched successfully",
            complaints
        });

    } catch (error) {
        console.error("Get complaints error:", error);

        return res.status(500).json({
            message: "Server error while fetching complaints"
        });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // Citizen can only view their own complaint
        if (req.user.role === "citizen") {
            if (complaint.citizen.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You are not allowed to view this complaint"
                });
            }
        }

        // Officer can only view assigned complaints
        if (req.user.role === "officer") {
            if (
                !complaint.assignedOfficer ||
                complaint.assignedOfficer.toString() !== req.user.id
            ) {
                return res.status(403).json({
                    message: "You are not assigned to this complaint"
                });
            }
        }

        // Admin can view any complaint

        return res.status(200).json({
            complaint
        });

    } catch (error) {
        console.error("Get complaint error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            citizen: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // Only pending complaints can be updated
        if (complaint.status !== "pending") {
            return res.status(400).json({
                message: "Only pending complaints can be updated"
            });
        }

        const {
            title,
            description,
            category,
            address
        } = req.body;

        complaint.title = title;
        complaint.description = description;
        complaint.category = category;
        complaint.location.address = address;

        const updatedComplaint = await complaint.save();

        return res.status(200).json({
            message: "Complaint updated successfully",
            complaint: updatedComplaint
        });

    } catch (error) {
        console.error("Update complaint error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            citizen: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // Only pending complaints can be deleted
        if (complaint.status !== "pending") {
            return res.status(400).json({
                message: "Only pending complaints can be deleted"
            });
        }

        await Complaint.deleteOne({
            _id: req.params.id
        });

        return res.status(200).json({
            message: "Complaint deleted successfully"
        });

    } catch (error) {
        console.error("Delete complaint error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getAssignedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            assignedOfficer: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            complaints
        });

    } catch (error) {
        console.error("Get assigned complaints error:", error);

        return res.status(500).json({
            message: "Server error while fetching assigned complaints"
        });
    }
};

const assignComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { officerId } = req.body;

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const officer = await User.findById(officerId);

        if (!officer) {
            return res.status(404).json({
                message: "Officer not found"
            });
        }

        if (officer.role !== "officer") {
            return res.status(400).json({
                message: "Selected user is not an officer"
            });
        }

        complaint.assignedOfficer = officer._id;

        await complaint.save();

        return res.status(200).json({
            message: "Complaint assigned successfully",
            complaint
        });

    } catch (error) {
        console.error(
            "ASSIGN COMPLAINT ERROR:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("citizen", "name email")
            .populate("assignedOfficer", "name email")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            complaints
        });

    } catch (error) {
        console.error(
            "Get all complaints error:",
            error
        );

        return res.status(500).json({
            message: "Server error while fetching complaints"
        });
    }
};


const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // Officer can only update assigned complaints
        if (req.user.role === "officer") {
            if (
                !complaint.assignedOfficer ||
                complaint.assignedOfficer.toString() !== req.user.id
            ) {
                return res.status(403).json({
                    message: "You are not assigned to this complaint"
                });
            }
        }

        const allowedStatuses = [
            "pending",
            "in_progress",
            "resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const validTransitions = {
            pending: ["in_progress"],
            in_progress: ["resolved"],
            resolved: []
        };

        if (!validTransitions[complaint.status].includes(status)) {
            return res.status(400).json({
                message:
                    `Cannot change status from ${complaint.status} to ${status}`
            });
        }

        complaint.status = status;

        complaint.statusHistory.push({
            status: status,
            changedAt: new Date()
        });

        await complaint.save();

        return res.status(200).json({
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {
        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getAssignedComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            assignedOfficer: req.user.id
        }).populate("citizen", "name email");

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        return res.status(200).json({
            complaint
        });

    } catch (error) {
        console.error(
            "Get assigned complaint error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getWorkerComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            worker: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            complaints
        });

    } catch (error) {
        console.error("Get worker complaints error:", error);

        return res.status(500).json({
            message: "Server error while fetching worker complaints"
        });
    }
};

const assignWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const { workerId } = req.body;

        const worker = await User.findOne({
            _id: workerId,
            role: "worker"
        });

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        complaint.worker = workerId;

        await complaint.save();

        return res.status(200).json({
            message: "Worker assigned successfully",
            complaint
        });

    } catch (error) {
        console.error("Assign worker error:", error);

        return res.status(500).json({
            message: "Server error while assigning worker"
        });
    }
};

const getWorkerComplaintById = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findOne({
            _id: id,
            worker: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found or not assigned to you"
            });
        }

        return res.status(200).json({
            complaint
        });

    } catch (error) {
        console.error("Get worker complaint error:", error);

        return res.status(500).json({
            message: "Server error while fetching complaint"
        });
    }
};

const updateWorkerComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await Complaint.findOne({
            _id: id,
            worker: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found or not assigned to you"
            });
        }

        const allowedStatuses = [
            "in_progress",
            "resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const validTransitions = {
            pending: ["in_progress"],
            assigned: ["in_progress"],
            in_progress: ["resolved"],
            resolved: [],
            rejected: []
        };

        if (!validTransitions[complaint.status].includes(status)) {
            return res.status(400).json({
                message:
                    `Cannot change status from ${complaint.status} to ${status}`
            });
        }

        complaint.status = status;

        complaint.statusHistory.push({
            status
        });

        await complaint.save();

        return res.status(200).json({
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {
        console.error(
            "Worker status update error:",
            error
        );

        return res.status(500).json({
            message: "Server error while updating complaint status"
        });
    }
};

const getComplaintAnalytics = async (req, res) => {
    try {
        const total = await Complaint.countDocuments();
        const pending = await Complaint.countDocuments({ status: "pending" });
        const assigned = await Complaint.countDocuments({ status: "assigned" });
        const inProgress = await Complaint.countDocuments({ status: "in_progress" });
        const resolved = await Complaint.countDocuments({ status: "resolved" });
        const rejected = await Complaint.countDocuments({ status: "rejected" });

        const roadDamage = await Complaint.countDocuments({ category: "road_damage" });
        const streetLight = await Complaint.countDocuments({ category: "street_light" });
        const garbageCollection = await Complaint.countDocuments({ category: "garbage_collection" });

        return res.status(200).json({
            analytics: {
                total, pending, assigned, inProgress, resolved, rejected, categories: { roadDamage, streetLight, garbageCollection }
            }
        });
    }
    catch (error) {
        console.error("Get complaint analytics error:", error)
        return res.status(500).json({
            message: "Server error while fetching complaint analytics"
        });
    }
}

module.exports = {
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
    getComplaintAnalytics
};