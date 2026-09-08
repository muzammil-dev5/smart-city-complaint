const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Department = require("../models/Department");
const ComplaintActivity = require("../models/ComplaintActivity");
const Notification = require("../models/Notification");
const cloudinary = require("../../src/config/cloudinary");


const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split("/upload/");
        if (parts.length < 2) return null;

        const publicIdWithExtension = parts[1]
            .split("/")
            .slice(1)
            .join("/");

        return publicIdWithExtension.replace(/\.[^/.]+$/, "");
    } catch (error) {
        return null;
    }
};

const createComplaint = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        const {
            title,
            description,
            category,
            department
        } = req.body;

        let location;

        try {
            location = req.body.location
                ? JSON.parse(req.body.location)
                : null;
        } catch (error) {
            return res.status(400).json({
                message: "Invalid location data"
            });
        }

        const imageUrls = req.files
            ? req.files.map((file) => file.path)
            : [];

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
            citizen: req.user.id,

            images: imageUrls,

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

        let existingImages = [];

        try {
            existingImages = req.body.existingImages
                ? JSON.parse(req.body.existingImages)
                : [];
        } catch (error) {
            return res.status(400).json({
                message: "Invalid existing images data"
            });
        }
        const oldImages = complaint.images || [];

        const removedImages = oldImages.filter(
            (oldImage) => !existingImages.includes(oldImage)
        );

        for (const imageUrl of removedImages) {
            const publicId = getPublicIdFromUrl(imageUrl);

            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);

                    console.log(
                        `Removed image deleted from Cloudinary: ${publicId}`
                    );
                } catch (error) {
                    console.error(
                        `Failed to delete Cloudinary image: ${publicId}`,
                        error
                    );
                }
            }
        }

        const newImageUrls = req.files
            ? req.files.map((file) => file.path)
            : [];

        complaint.title = title;
        complaint.description = description;
        complaint.category = category;
        complaint.location.address = address;
        complaint.images = [...existingImages, ...newImageUrls];

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

        if (complaint.images && complaint.images.length > 0) {
            for (const imageUrl of complaint.images) {
                const publicId = getPublicIdFromUrl(imageUrl);

                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                        console.log(
                            `Cloudinary image deleted: ${publicId}`
                        );
                    } catch (error) {
                        console.error(
                            `Failed to delete Cloudinary image: ${publicId}`,
                            error
                        );
                    }
                }
            }
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
        const { departmentId, officerId } = req.body;

        if (!departmentId || !officerId) {
            return res.status(400).json({
                message: "Department and officer are required"
            });
        }

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // Check department
        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(400).json({
                message: "Department not found"
            });
        }

        // Check officer
        const officer = await User.findOne({
            _id: officerId,
            role: "officer"
        });

        if (!officer) {
            return res.status(400).json({
                message: "Officer not found"
            });
        }

        // Assign department and officer
        complaint.department = departmentId;
        complaint.assignedOfficer = officerId;
        complaint.officer = officerId;

        // Update status
        if (complaint.status === "pending") {
            complaint.status = "assigned";
        }

        // Add status history
        complaint.statusHistory.push({
            status: "assigned",
            changedAt: new Date()
        });

        await complaint.save();

        await ComplaintActivity.create({
            complaint: complaint._id,
            action: "Complaint assigned",
            performedBy: req.user.id,
            role: req.user.role
        });

        await Notification.create({
            recipient: officerId,
            complaint: complaint._id,
            type: "complaint_assigned",
            message: `Complaint "${complaint.title}" has been assigned to you.`
        });

        const updatedComplaint = await Complaint.findById(id)
            .populate("department", "name description")
            .populate("assignedOfficer", "name email")
            .populate("worker", "name email");

        return res.status(200).json({
            message: "Complaint assigned successfully",
            complaint: updatedComplaint
        });

    } catch (error) {
        console.error("Assign complaint error:", error);

        return res.status(500).json({
            message: "Server error while assigning complaint"
        });
    }
};

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("citizen", "name email")
            .populate("assignedOfficer", "name email")
            .populate("worker", "name email")
            .populate("department", "name description")
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

        // Officer can only update their assigned complaint
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

        // Officer can only start the complaint
        if (status !== "in_progress") {
            return res.status(400).json({
                message: "Officer can only start a complaint"
            });
        }

        // Officer can only start an assigned complaint
        if (complaint.status !== "assigned") {
            return res.status(400).json({
                message:
                    `Cannot change status from ${complaint.status} to in_progress`
            });
        }

        complaint.status = "in_progress";

        complaint.statusHistory.push({
            status: "in_progress",
            changedAt: new Date()
        });

        await complaint.save();

        await ComplaintActivity.create({
            complaint: complaint._id,
            action: "Complaint started",
            performedBy: req.user.id,
            role: req.user.role
        });

        await Notification.create({
            recipient: complaint.citizen,
            complaint: complaint._id,
            type: "complaint_started",
            message: `Your complaint "${complaint.title}" has been started by the officer.`
        });


        return res.status(200).json({
            message: "Complaint started successfully",
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

        await ComplaintActivity.create({
            complaint: complaint._id,
            action: "Worker assigned",
            performedBy: req.user.id,
            role: req.user.role
        });

        await Notification.create({
            recipient: workerId,
            complaint: complaint._id,
            type: "worker_assigned",
            message: `Complaint "${complaint.title}" has been assigned to you.`
        });

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

const completeWorkerComplaint = async (req, res) => {

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

        // Only in-progress complaints can be completed
        if (complaint.status !== "in_progress") {
            return res.status(400).json({
                message: "Only complaints in progress can be completed"
            });
        }

        // Completion proof is required
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one completion image is required"
            });
        }

        // Cloudinary URLs from uploadMiddleware
        const completionImageUrls = req.files.map(
            (file) => file.path
        );

        // Save completion images separately
        complaint.completionImages = completionImageUrls;

        // Mark complaint as resolved
        complaint.status = "resolved";

        complaint.statusHistory.push({
            status: "resolved",
            changedAt: new Date()
        });

        await complaint.save();

        // Activity
        await ComplaintActivity.create({
            complaint: complaint._id,
            action: "complaint_resolved",
            performedBy: req.user.id,
            role: req.user.role
        });

        // Notify citizen
        await Notification.create({
            recipient: complaint.citizen,
            complaint: complaint._id,
            type: "complaint_resolved",
            message: `Your complaint "${complaint.title}" has been resolved.`
        });

        // Notify officer
        if (complaint.assignedOfficer) {
            await Notification.create({
                recipient: complaint.assignedOfficer,
                complaint: complaint._id,
                type: "complaint_resolved",
                message: `Complaint "${complaint.title}" has been resolved by the worker.`
            });
        }

        return res.status(200).json({
            message: "Complaint completed successfully",
            complaint
        });

    } catch (error) {
        console.error(
            "Worker complaint completion error:",
            error
        );

        return res.status(500).json({
            message: "Server error while completing complaint"
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
            "resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const validTransitions = {
            pending: [],
            assigned: [],
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

        if (status === "resolved") {
            await ComplaintActivity.create({
                complaint: complaint._id,
                action: "Complaint resolved",
                performedBy: req.user.id,
                role: req.user.role
            });

            await Notification.create({
                recipient: complaint.citizen,
                complaint: complaint._id,
                type: "complaint_resolved",
                message: `Your complaint "${complaint.title}" has been resolved.`
            });

            if (complaint.assignedOfficer) {
                await Notification.create({
                    recipient: complaint.assignedOfficer,
                    complaint: complaint._id,
                    type: "complaint_resolved",
                    message: `Complaint "${complaint.title}" has been resolved by the worker.`
                });
            }
        }

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

const getComplaintReports = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        // Build date filter
        const dateFilter = {};

        if (fromDate || toDate) {
            dateFilter.createdAt = {};

            if (fromDate) {
                dateFilter.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
            }

            if (toDate) {
                dateFilter.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
            }
        }

        // --------------------------------
        // SUMMARY
        // --------------------------------

        const total = await Complaint.countDocuments(dateFilter);

        const pending = await Complaint.countDocuments({
            ...dateFilter,
            status: "pending"
        });

        const assigned = await Complaint.countDocuments({
            ...dateFilter,
            status: "assigned"
        });

        const inProgress = await Complaint.countDocuments({
            ...dateFilter,
            status: "in_progress"
        });

        const resolved = await Complaint.countDocuments({
            ...dateFilter,
            status: "resolved"
        });

        const rejected = await Complaint.countDocuments({
            ...dateFilter,
            status: "rejected"
        });

        // --------------------------------
        // CATEGORY REPORT
        // --------------------------------

        const categoryReport = await Complaint.aggregate([
            {
                $match: dateFilter
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        // --------------------------------
        // STATUS REPORT
        // --------------------------------

        const statusReport = await Complaint.aggregate([
            {
                $match: dateFilter
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        // --------------------------------
        // DEPARTMENT REPORT
        // --------------------------------

        const departmentReport = await Complaint.aggregate([
            {
                $match: {
                    ...dateFilter,
                    department: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$department",
                    totalComplaints: { $sum: 1 },

                    resolved: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "resolved"] },
                                1,
                                0
                            ]
                        }
                    },

                    pending: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0
                            ]
                        }
                    },

                    inProgress: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "in_progress"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    departmentName: "$department.name",
                    totalComplaints: 1,
                    resolved: 1,
                    pending: 1,
                    inProgress: 1
                }
            },
            {
                $sort: {
                    totalComplaints: -1
                }
            }
        ]);

        // --------------------------------
        // DATE-WISE REPORT
        // --------------------------------

        const dateWiseReport = await Complaint.aggregate([
            {
                $match: dateFilter
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        return res.status(200).json({
            report: {
                dateRange: {
                    fromDate: fromDate || null,
                    toDate: toDate || null
                },

                summary: {
                    total,
                    pending,
                    assigned,
                    inProgress,
                    resolved,
                    rejected
                },

                categoryReport,

                statusReport,

                departmentReport,

                dateWiseReport
            }
        });

    } catch (error) {
        console.error(
            "Get complaint reports error:",
            error
        );

        return res.status(500).json({
            message: "Server error while generating complaint report"
        });
    }
};

const getComplaintActivities = async (req, res) => {
    try {
        const activities =
            await ComplaintActivity.find({
                complaint: req.params.id
            })
                .populate(
                    "performedBy",
                    "name role"
                )
                .sort({
                    createdAt: 1
                });

        return res.status(200).json({
            activities
        });

    } catch (error) {
        console.error(
            "Get complaint activities error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

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
    completeWorkerComplaint,
    updateWorkerComplaintStatus,
    getComplaintAnalytics,
    getComplaintActivities,
    getComplaintReports
};