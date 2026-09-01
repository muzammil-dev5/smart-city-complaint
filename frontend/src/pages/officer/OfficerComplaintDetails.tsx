import { Box, Paper, Typography, Chip, Button, Rating } from "@mui/material";
import {
    ArrowBack, CalendarTodayOutlined, CategoryOutlined, DescriptionOutlined, PlayArrow, EmailOutlined, EngineeringOutlined
    // LocationOnOutlined,
    // PersonOutline,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignedComplaintById, updateComplaintStatus } from "../../services/complaintService";
import { getComplaintFeedback } from "../../services/feedbackService";
import "./OfficerComplaintDetails.scss";
import type { Complaint } from "../../types/user";

const getStatusLabel = (status: Complaint["status"]) => {
    switch (status) {
        case "in_progress":
            return "In Progress";

        case "assigned":
            return "Assigned";

        case "resolved":
            return "Resolved";

        case "rejected":
            return "Rejected";

        default:
            return "Pending";
    }
};

const OfficerComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [feedback, setFeedback] = useState<{
        rating: number;
        comment?: string;
        createdAt: string;
    } | null>(null);
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;
            try {
                const response = await getAssignedComplaintById(id);
                setComplaint(response.complaint);
                if (response.complaint.status === "resolved") {
                    try {
                        const feedbackResponse = await getComplaintFeedback(id);

                        setFeedback(feedbackResponse.feedback || null);

                    } catch (error) {
                        console.error("Failed to fetch feedback:", error);
                        setFeedback(null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch complaint:", error);

            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);


    const handleStartComplaint = async () => {
        if (!complaint) return;
        try {
            setUpdating(true);
            const response = await updateComplaintStatus(complaint._id, "in_progress");
            setComplaint(response.complaint);

        } catch (error) {
            console.error("Failed to start complaint:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Box className="officerComplaintDetails_loading">
                <Typography>
                    Loading complaint...
                </Typography>
            </Box>
        );
    }

    if (!complaint) {
        return (
            <Box className="officerComplaintDetails_empty">
                <Typography>
                    Complaint not found.
                </Typography>
            </Box>
        );
    }


    return (

        <Box className="officerComplaintDetails">
            <Box className="officerComplaintDetails_header">
                <Button
                    className="officerComplaintDetails_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/officer/dashboard")}>
                    Back to Complaints
                </Button>

                <Typography className="officerComplaintDetails_title">
                    Complaint Details
                </Typography>

                <Typography className="officerComplaintDetails_subtitle">
                    Review the assigned complaint and manage its workflow.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                className="officerComplaintDetails_card">
                <Box className="officerComplaintDetails_cardHeader">
                    <Box>
                        <Typography className="officerComplaintDetails_cardTitle">
                            Complaint Information
                        </Typography>

                        <Typography className="officerComplaintDetails_cardSubtitle">
                            Details of the complaint assigned to you.
                        </Typography>
                    </Box>

                    <Chip
                        label={getStatusLabel(complaint.status)}
                        className={`officerStatus officerStatus_${complaint.status}`}
                    />
                </Box>

                <Box className="officerComplaintDetails_field">
                    <Box className="officerComplaintDetails_icon">
                        <DescriptionOutlined />
                    </Box>
                    <Box>
                        <Typography className="officerComplaintDetails_label">
                            Complaint Title
                        </Typography>

                        <Typography className="officerComplaintDetails_value">
                            {complaint.title}
                        </Typography>
                    </Box>
                </Box>

                <Box className="officerComplaintDetails_field officerComplaintDetails_descriptionField">
                    <Box className="officerComplaintDetails_icon">
                        <DescriptionOutlined />
                    </Box>
                    <Box>
                        <Typography className="officerComplaintDetails_label">
                            Description
                        </Typography>

                        <Typography className="officerComplaintDetails_description">
                            {complaint.description}
                        </Typography>
                    </Box>
                </Box>

                <Box className="officerComplaintDetails_grid">
                    <Box className="officerComplaintDetails_field">
                        <Box className="officerComplaintDetails_icon">
                            <CategoryOutlined />
                        </Box>
                        <Box>
                            <Typography className="officerComplaintDetails_label">
                                Category
                            </Typography>

                            <Typography className="officerComplaintDetails_value">
                                {complaint.category}
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="officerComplaintDetails_field">
                        <Box className="officerComplaintDetails_icon">
                            <CalendarTodayOutlined />
                        </Box>
                        <Box>
                            <Typography className="officerComplaintDetails_label">
                                Submitted Date
                            </Typography>

                            <Typography className="officerComplaintDetails_value">
                                {new Date(
                                    complaint.createdAt
                                ).toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {complaint.citizen && (
                    <Box className="officerComplaintDetails_citizen">
                        <Typography className="officerComplaintDetails_citizenTitle">
                            Citizen Information
                        </Typography>
                        <Box className="officerComplaintDetails_citizenGrid">
                            <Box className="officerComplaintDetails_citizenItem">
                                {/* <PersonIcon /> */}
                                <EmailOutlined />
                                <Box>
                                    <Typography className="officerComplaintDetails_label">
                                        Citizen
                                    </Typography>

                                    <Typography className="officerComplaintDetails_value">
                                        {complaint.citizen.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className="officerComplaintDetails_citizenItem">
                                <EmailOutlined />
                                <Box>
                                    <Typography className="officerComplaintDetails_label">
                                        Email
                                    </Typography>

                                    <Typography className="officerComplaintDetails_value">
                                        {complaint.citizen.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}

                {complaint.status === "assigned" && (
                    <Box className="officerComplaintDetails_actions">
                        <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            disabled={updating}
                            className="officerComplaintDetails_startButton"
                            onClick={handleStartComplaint}>
                            {updating
                                ? "Starting..."
                                : "Start Complaint"}
                        </Button>
                    </Box>
                )}

                {complaint.status === "in_progress" && (
                    <Box className="officerComplaintDetails_infoMessage">
                        <EngineeringOutlined />
                        <Typography>
                            Complaint started. Waiting for the worker
                            to complete the work.
                        </Typography>
                    </Box>
                )}
            </Paper>

            <Paper
                elevation={0}
                className="officerComplaintDetails_card">
                <Typography className="officerComplaintDetails_cardTitle">
                    Complaint Workflow
                </Typography>

                <Typography className="officerComplaintDetails_cardSubtitle">
                    Current progress of this complaint.
                </Typography>

                <Box className="officerComplaintDetails_workflow">
                    <Box
                        className={`workflowStep ${complaint.status === "assigned" ||
                            complaint.status === "in_progress" ||
                            complaint.status === "resolved"
                            ? "workflowStep_active"
                            : ""
                            }`}>
                        <Box className="workflowDot"> 1 </Box>
                        <Typography>Assigned </Typography>
                    </Box>

                    <Box className="workflowLine" />
                    <Box
                        className={`workflowStep ${complaint.status === "in_progress" ||
                            complaint.status === "resolved"
                            ? "workflowStep_active"
                            : ""
                            }`}>
                        <Box className="workflowDot">  2</Box>
                        <Typography> In Progress</Typography>
                    </Box>

                    <Box className="workflowLine" />
                    <Box
                        className={`workflowStep ${complaint.status === "resolved"
                            ? "workflowStep_active"
                            : ""
                            }`}>
                        <Box className="workflowDot"> 3 </Box>
                        <Typography> Resolved</Typography>
                    </Box>
                </Box>
            </Paper>
            {complaint.status === "resolved" && feedback && (
                <Paper
                    elevation={0}
                    className="officerComplaintDetails_card"
                >
                    <Typography className="officerComplaintDetails_cardTitle">
                        Citizen Feedback
                    </Typography>

                    <Typography className="officerComplaintDetails_cardSubtitle">
                        Feedback submitted by the citizen after complaint resolution.
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <Typography className="officerComplaintDetails_label">
                            Rating
                        </Typography>

                        <Rating
                            value={feedback.rating}
                            readOnly
                        />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography className="officerComplaintDetails_label">
                            Comment
                        </Typography>

                        <Typography className="officerComplaintDetails_value">
                            {feedback.comment || "No comment provided."}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{ mt: 2 }}
                    >
                        Submitted on:{" "}
                        {new Date(feedback.createdAt).toLocaleString()}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default OfficerComplaintDetails;