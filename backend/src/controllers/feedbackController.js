const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");

const createFeedback = async (req, res) => {
    try {
        const { complaintId, rating, comment } = req.body;

        if (!complaintId || !rating) {
            return res.status(400).json({
                message: "Complaint and rating are required"
            });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        if (complaint.citizen.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to give feedback"
            });
        }

        if (complaint.status !== "resolved") {
            return res.status(400).json({
                message: "Feedback can only be submitted for resolved complaints"
            });
        }

        const existingFeedback = await Feedback.findOne({
            complaint: complaintId,
            citizen: req.user.id
        });

        if (existingFeedback) {
            return res.status(400).json({
                message: "You have already submitted feedback"
            });
        }

        const feedback = await Feedback.create({
            complaint: complaintId,
            citizen: req.user.id,
            rating,
            comment: comment || ""
        });

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });

    } catch (error) {
        console.error("Create feedback error:", error);

        return res.status(500).json({
            message: "Server error while creating feedback"
        });
    }
};

const getComplaintFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findOne({
            complaint: req.params.complaintId
        })
            .populate("citizen", "name email")
            .populate("complaint", "title status");

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            feedback
        });

    } catch (error) {
        console.error("Get feedback error:", error);

        return res.status(500).json({
            message: "Server error while fetching feedback"
        });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("citizen", "name email")
            .populate("complaint", "title status");

        return res.status(200).json({
            feedback
        });

    } catch (error) {
        console.error("Get all feedback error:", error);

        return res.status(500).json({
            message: "Server error while fetching feedback"
        });
    }
};

module.exports = {
    createFeedback,
    getComplaintFeedback,
    getAllFeedback
};