import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
    Rating,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import {
    ArrowBack,
    CalendarTodayOutlined,
    CategoryOutlined,
    DescriptionOutlined,
    PlayArrow,
    EmailOutlined,
    EngineeringOutlined,
    AssignmentIndOutlined
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAssignedComplaintById,
    updateComplaintStatus,
    assignWorker
} from "../../services/complaintService";

import { getWorkers } from "../../services/userService";
import { getComplaintFeedback } from "../../services/feedbackService";

import "./OfficerComplaintDetails.scss";

import type { Complaint } from "../../types/user";

interface Worker {
    _id: string;
    name: string;
    email: string;
}

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

    const [complaint, setComplaint] =
        useState<Complaint | null>(null);

    const [feedback, setFeedback] = useState<{
        rating: number;
        comment?: string;
        createdAt: string;
    } | null>(null);

    const [workers, setWorkers] = useState<Worker[]>([]);

    const [selectedWorker, setSelectedWorker] =
        useState("");

    const [updating, setUpdating] =
        useState(false);

    const [assigningWorker, setAssigningWorker] =
        useState(false);

    const [loadingWorkers, setLoadingWorkers] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;

            try {
                const response =
                    await getAssignedComplaintById(id);

                setComplaint(response.complaint);

                if (response.complaint.worker) {
                    setSelectedWorker(
                        response.complaint.worker._id ||
                        response.complaint.worker
                    );
                }

                if (
                    response.complaint.status ===
                    "resolved"
                ) {
                    try {
                        const feedbackResponse =
                            await getComplaintFeedback(id);

                        setFeedback(
                            feedbackResponse.feedback ||
                            null
                        );

                    } catch (error) {
                        console.error(
                            "Failed to fetch feedback:",
                            error
                        );

                        setFeedback(null);
                    }
                }

            } catch (error) {
                console.error(
                    "Failed to fetch complaint:",
                    error
                );

            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    // =====================================================
    // LOAD WORKERS
    // =====================================================

    useEffect(() => {
        const fetchWorkers = async () => {
            if (
                !complaint?.department ||
                complaint.status !== "in_progress"
            ) {
                return;
            }

            try {
                setLoadingWorkers(true);

                const departmentId =
                    typeof complaint.department === "string"
                        ? complaint.department
                        : complaint.department._id;

                const response =
                    await getWorkers(departmentId);

                setWorkers(
                    response.workers || []
                );

            } catch (error) {
                console.error(
                    "Failed to fetch workers:",
                    error
                );

                setWorkers([]);

            } finally {
                setLoadingWorkers(false);
            }
        };

        fetchWorkers();
    }, [
        complaint?.department,
        complaint?.status
    ]);

    // =====================================================
    // START COMPLAINT
    // =====================================================

    const handleStartComplaint = async () => {
        if (!complaint) return;

        try {
            setUpdating(true);

            const response =
                await updateComplaintStatus(
                    complaint._id,
                    "in_progress"
                );

            setComplaint(response.complaint);

        } catch (error) {
            console.error(
                "Failed to start complaint:",
                error
            );

        } finally {
            setUpdating(false);
        }
    };

    // =====================================================
    // ASSIGN WORKER
    // =====================================================

    const handleAssignWorker = async () => {
        if (!complaint || !selectedWorker) {
            return;
        }

        try {
            setAssigningWorker(true);

            const response =
                await assignWorker(
                    complaint._id,
                    selectedWorker
                );

            setComplaint(
                response.complaint
            );

        } catch (error) {
            console.error(
                "Failed to assign worker:",
                error
            );

        } finally {
            setAssigningWorker(false);
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

            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box className="officerComplaintDetails_header">

                <Button
                    className="officerComplaintDetails_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/officer/dashboard")
                    }
                >
                    Back to Complaints
                </Button>

                <Typography className="officerComplaintDetails_title">
                    Complaint Details
                </Typography>

                <Typography className="officerComplaintDetails_subtitle">
                    Review the assigned complaint and manage its workflow.
                </Typography>

            </Box>

            {/* =====================================================
                COMPLAINT INFORMATION
            ===================================================== */}

            <Paper
                elevation={0}
                className="officerComplaintDetails_card"
            >

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
                        label={getStatusLabel(
                            complaint.status
                        )}
                        className={`officerStatus officerStatus_${complaint.status}`}
                    />

                </Box>

                {/* TITLE */}

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

                {/* DESCRIPTION */}

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

                {/* CATEGORY + DATE */}

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

                {/* =====================================================
                    CITIZEN INFORMATION
                ===================================================== */}

                {complaint.citizen && (
                    <Box className="officerComplaintDetails_citizen">

                        <Typography className="officerComplaintDetails_citizenTitle">
                            Citizen Information
                        </Typography>

                        <Box className="officerComplaintDetails_citizenGrid">

                            <Box className="officerComplaintDetails_citizenItem">

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

                {/* =====================================================
                    START COMPLAINT
                ===================================================== */}

                {complaint.status === "assigned" && (
                    <Box className="officerComplaintDetails_actions">

                        <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            disabled={updating}
                            className="officerComplaintDetails_startButton"
                            onClick={
                                handleStartComplaint
                            }
                        >
                            {updating
                                ? "Starting..."
                                : "Start Complaint"}
                        </Button>

                    </Box>
                )}

                {/* =====================================================
                    ASSIGN WORKER
                ===================================================== */}

                {complaint.status === "in_progress" && (
                    <Box
                        className="officerComplaintDetails_workerAssignment"
                        sx={{ mt: 3 }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2
                            }}
                        >

                            <AssignmentIndOutlined />

                            <Typography
                                className="officerComplaintDetails_cardTitle"
                            >
                                Worker Assignment
                            </Typography>

                        </Box>

                        {complaint.worker ? (
                            <Box
                                className="officerComplaintDetails_infoMessage"
                            >

                                <EngineeringOutlined />

                                <Typography>
                                    Worker assigned:{" "}
                                    <strong>
                                        {typeof complaint.worker ===
                                            "object"
                                            ? complaint.worker.name
                                            : "Worker"}
                                    </strong>
                                </Typography>

                            </Box>
                        ) : (
                            <Box>

                                <FormControl
                                    fullWidth
                                    size="small"
                                >

                                    <InputLabel>
                                        Select Worker
                                    </InputLabel>

                                    <Select
                                        value={
                                            selectedWorker
                                        }
                                        label="Select Worker"
                                        onChange={(event) =>
                                            setSelectedWorker(
                                                event.target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            loadingWorkers ||
                                            assigningWorker
                                        }
                                    >

                                        <MenuItem value="">
                                            <em>
                                                Select Worker
                                            </em>
                                        </MenuItem>

                                        {workers.map(
                                            (worker) => (
                                                <MenuItem
                                                    key={
                                                        worker._id
                                                    }
                                                    value={
                                                        worker._id
                                                    }
                                                >
                                                    {worker.name}{" "}
                                                    -{" "}
                                                    {worker.email}
                                                </MenuItem>
                                            )
                                        )}

                                    </Select>

                                </FormControl>

                                <Box
                                    className="officerComplaintDetails_actions"
                                    sx={{ mt: 2 }}
                                >

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <AssignmentIndOutlined />
                                        }
                                        disabled={
                                            !selectedWorker ||
                                            assigningWorker ||
                                            loadingWorkers
                                        }
                                        onClick={
                                            handleAssignWorker
                                        }
                                    >
                                        {assigningWorker
                                            ? "Assigning..."
                                            : "Assign Worker"}
                                    </Button>

                                </Box>

                            </Box>
                        )}

                    </Box>
                )}

                {/* =====================================================
                    RESOLVED / WORKER WAITING INFO
                ===================================================== */}

                {complaint.status === "resolved" && (
                    <Box className="officerComplaintDetails_infoMessage">

                        <EngineeringOutlined />

                        <Typography>
                            Complaint has been resolved by the worker.
                        </Typography>

                    </Box>
                )}

            </Paper>

            {/* =====================================================
                WORKFLOW
            ===================================================== */}

            <Paper
                elevation={0}
                className="officerComplaintDetails_card"
            >

                <Typography className="officerComplaintDetails_cardTitle">
                    Complaint Workflow
                </Typography>

                <Typography className="officerComplaintDetails_cardSubtitle">
                    Current progress of this complaint.
                </Typography>

                <Box className="officerComplaintDetails_workflow">

                    <Box
                        className={`workflowStep ${complaint.status ===
                                "assigned" ||
                                complaint.status ===
                                "in_progress" ||
                                complaint.status ===
                                "resolved"
                                ? "workflowStep_active"
                                : ""
                            }`}
                    >

                        <Box className="workflowDot">
                            1
                        </Box>

                        <Typography>
                            Assigned
                        </Typography>

                    </Box>

                    <Box className="workflowLine" />

                    <Box
                        className={`workflowStep ${complaint.status ===
                                "in_progress" ||
                                complaint.status ===
                                "resolved"
                                ? "workflowStep_active"
                                : ""
                            }`}
                    >

                        <Box className="workflowDot">
                            2
                        </Box>

                        <Typography>
                            In Progress
                        </Typography>

                    </Box>

                    <Box className="workflowLine" />

                    <Box
                        className={`workflowStep ${complaint.status ===
                                "resolved"
                                ? "workflowStep_active"
                                : ""
                            }`}
                    >

                        <Box className="workflowDot">
                            3
                        </Box>

                        <Typography>
                            Resolved
                        </Typography>

                    </Box>

                </Box>

            </Paper>

            {/* =====================================================
                FEEDBACK
            ===================================================== */}

            {complaint.status === "resolved" &&
                feedback && (

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
                                value={
                                    feedback.rating
                                }
                                readOnly
                            />

                        </Box>

                        <Box sx={{ mt: 3 }}>

                            <Typography className="officerComplaintDetails_label">
                                Comment
                            </Typography>

                            <Typography className="officerComplaintDetails_value">
                                {feedback.comment ||
                                    "No comment provided."}
                            </Typography>

                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ mt: 2 }}
                        >
                            Submitted on:{" "}
                            {new Date(
                                feedback.createdAt
                            ).toLocaleString()}
                        </Typography>

                    </Paper>

                )}

        </Box>
    );
};

export default OfficerComplaintDetails;