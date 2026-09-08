const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "road_damage",
                "street_light",
                "garbage_collection"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "assigned",
                "in_progress",
                "resolved",
                "rejected"
            ],
            default: "pending"
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "pending",
                        "assigned",
                        "in_progress",
                        "resolved",
                        "rejected"
                    ],
                    required: true
                },
                changedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        location: {
            address: {
                type: String,
                required: true
            },

            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }
        },

        citizen: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        officer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        assignedOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null
        },

        images: [
            {
                type: String
            }
        ],

        completionImages: [
            {
                type: String
            }
        ],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);