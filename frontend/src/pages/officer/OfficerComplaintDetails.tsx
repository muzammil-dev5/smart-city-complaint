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
    MenuItem,
    Divider,
    CircularProgress
} from "@mui/material";

import {
    ArrowBack,
    CalendarTodayOutlined,
    CategoryOutlined,
    DescriptionOutlined,
    PlayArrow,
    EmailOutlined,
    EngineeringOutlined,
    AssignmentIndOutlined,
    LocationOnOutlined,
    CheckCircleOutlineRounded,
    AccessTimeOutlined
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
    const [selectedWorker, setSelectedWorker] = useState("");
    const [updating, setUpdating] = useState(false);
    const [assigningWorker, setAssigningWorker] = useState(false);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [loading, setLoading] = useState(true);

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
                            feedbackResponse.feedback || null
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

                setWorkers(response.workers || []);
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

            setComplaint(response.complaint);
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
                <CircularProgress size={30} />
                <Typography>
                    Loading complaint details...
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

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/officer/dashboard")
                    }
                >
                    Back to Complaints
                </Button>
            </Box>
        );
    }

    const isAssigned =
        complaint.status === "assigned" ||
        complaint.status === "in_progress" ||
        complaint.status === "resolved";

    const isInProgress =
        complaint.status === "in_progress" ||
        complaint.status === "resolved";

    const isResolved =
        complaint.status === "resolved";

    return (
        <Box className="officerComplaintDetails">

            {/* =====================================================
                PAGE HEADER
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

                <Box className="officerComplaintDetails_headerContent">

                    <Box>
                        <Typography className="officerComplaintDetails_title">
                            Complaint Details
                        </Typography>

                        <Typography className="officerComplaintDetails_subtitle">
                            Review complaint information and manage the assigned workflow.
                        </Typography>
                    </Box>

                    <Chip
                        label={getStatusLabel(
                            complaint.status
                        )}
                        className={`officerStatus officerStatus_${complaint.status}`}
                    />

                </Box>

            </Box>

            {/* =====================================================
                COMPLAINT INFORMATION
            ===================================================== */}

            <Paper
                elevation={0}
                className="officerComplaintDetails_card"
            >

                <Box className="officerComplaintDetails_sectionHeader">

                    <Box className="officerComplaintDetails_sectionIcon">
                        <DescriptionOutlined />
                    </Box>

                    <Box>
                        <Typography className="officerComplaintDetails_cardTitle">
                            Complaint Information
                        </Typography>

                        <Typography className="officerComplaintDetails_cardSubtitle">
                            Complete details submitted by the citizen.
                        </Typography>
                    </Box>

                </Box>

                <Divider className="officerComplaintDetails_divider" />

                {/* TITLE */}

                <Box className="officerComplaintDetails_detailBlock">

                    <Box className="officerComplaintDetails_detailIcon">
                        <DescriptionOutlined />
                    </Box>

                    <Box className="officerComplaintDetails_detailContent">

                        <Typography className="officerComplaintDetails_label">
                            Complaint Title
                        </Typography>

                        <Typography className="officerComplaintDetails_value officerComplaintDetails_titleValue">
                            {complaint.title}
                        </Typography>

                    </Box>

                </Box>

                {/* DESCRIPTION */}

                <Box className="officerComplaintDetails_detailBlock officerComplaintDetails_descriptionBlock">

                    <Box className="officerComplaintDetails_detailIcon">
                        <DescriptionOutlined />
                    </Box>

                    <Box className="officerComplaintDetails_detailContent">

                        <Typography className="officerComplaintDetails_label">
                            Description
                        </Typography>

                        <Typography className="officerComplaintDetails_description">
                            {complaint.description}
                        </Typography>

                    </Box>

                </Box>

                {/* CATEGORY / DATE / LOCATION */}

                <Box className="officerComplaintDetails_infoGrid">

                    <Box className="officerComplaintDetails_infoItem">

                        <CategoryOutlined />

                        <Box>
                            <Typography className="officerComplaintDetails_label">
                                Category
                            </Typography>

                            <Typography className="officerComplaintDetails_value">
                                {complaint.category}
                            </Typography>
                        </Box>

                    </Box>

                    <Box className="officerComplaintDetails_infoItem">

                        <CalendarTodayOutlined />

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

                    {complaint.location && (
                        <Box className="officerComplaintDetails_infoItem">
                            <LocationOnOutlined />

                            <Box>
                                <Typography className="officerComplaintDetails_label">
                                    Location
                                </Typography>

                                <Typography className="officerComplaintDetails_value">
                                    {complaint.location.address}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                </Box>

                {/* =====================================================
                    CITIZEN INFORMATION
                ===================================================== */}

                {complaint.citizen && (
                    <Box className="officerComplaintDetails_citizen">

                        <Box className="officerComplaintDetails_subSectionHeader">

                            <Box className="officerComplaintDetails_subSectionIcon">
                                <EmailOutlined />
                            </Box>

                            <Box>
                                <Typography className="officerComplaintDetails_citizenTitle">
                                    Citizen Information
                                </Typography>

                                <Typography className="officerComplaintDetails_citizenSubtitle">
                                    Information about the complaint requester.
                                </Typography>
                            </Box>

                        </Box>

                        <Box className="officerComplaintDetails_citizenGrid">

                            <Box className="officerComplaintDetails_citizenItem">

                                <Typography className="officerComplaintDetails_label">
                                    Citizen Name
                                </Typography>

                                <Typography className="officerComplaintDetails_value">
                                    {complaint.citizen.name}
                                </Typography>

                            </Box>

                            <Box className="officerComplaintDetails_citizenItem">

                                <Typography className="officerComplaintDetails_label">
                                    Email Address
                                </Typography>

                                <Typography className="officerComplaintDetails_value">
                                    {complaint.citizen.email}
                                </Typography>

                            </Box>

                        </Box>

                    </Box>
                )}

                {/* =====================================================
                    START COMPLAINT
                ===================================================== */}

                {complaint.status === "assigned" && (
                    <Box className="officerComplaintDetails_actionBox">

                        <Box>
                            <Typography className="officerComplaintDetails_actionTitle">
                                Ready to start?
                            </Typography>

                            <Typography className="officerComplaintDetails_actionSubtitle">
                                Start working on this complaint to move it into progress.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={
                                updating
                                    ? <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                    : <PlayArrow />
                            }
                            disabled={updating}
                            className="officerComplaintDetails_primaryButton"
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

            </Paper>

            {/* =====================================================
                WORKER ASSIGNMENT
            ===================================================== */}

            {complaint.status === "in_progress" && (
                <Paper
                    elevation={0}
                    className="officerComplaintDetails_card"
                >

                    <Box className="officerComplaintDetails_sectionHeader">

                        <Box className="officerComplaintDetails_sectionIcon officerComplaintDetails_workerIcon">
                            <AssignmentIndOutlined />
                        </Box>

                        <Box>
                            <Typography className="officerComplaintDetails_cardTitle">
                                Worker Assignment
                            </Typography>

                            <Typography className="officerComplaintDetails_cardSubtitle">
                                Assign a department worker to handle this complaint.
                            </Typography>
                        </Box>

                    </Box>

                    <Divider className="officerComplaintDetails_divider" />

                    {complaint.worker ? (
                        <Box className="officerComplaintDetails_assignedWorker">

                            <Box className="officerComplaintDetails_assignedWorkerIcon">
                                <EngineeringOutlined />
                            </Box>

                            <Box>
                                <Typography className="officerComplaintDetails_label">
                                    Assigned Worker
                                </Typography>

                                <Typography className="officerComplaintDetails_workerName">
                                    {typeof complaint.worker ===
                                        "object"
                                        ? complaint.worker.name
                                        : "Worker"}
                                </Typography>

                                {typeof complaint.worker ===
                                    "object" &&
                                    complaint.worker.email && (
                                        <Typography className="officerComplaintDetails_workerEmail">
                                            {complaint.worker.email}
                                        </Typography>
                                    )}
                            </Box>

                            <Chip
                                label="Assigned"
                                size="small"
                                className="workerAssignedChip"
                            />

                        </Box>
                    ) : (
                        <Box>

                            {loadingWorkers ? (
                                <Box className="officerComplaintDetails_workerLoading">

                                    <CircularProgress
                                        size={22}
                                    />

                                    <Typography>
                                        Loading available workers...
                                    </Typography>

                                </Box>
                            ) : workers.length === 0 ? (
                                <Box className="officerComplaintDetails_noWorkers">

                                    <EngineeringOutlined />

                                    <Box>
                                        <Typography>
                                            No workers available
                                        </Typography>

                                        <Typography>
                                            There are currently no workers available in this department.
                                        </Typography>
                                    </Box>

                                </Box>
                            ) : (
                                <>
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        className="officerComplaintDetails_workerSelect"
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
                                                    event.target.value
                                                )
                                            }
                                            disabled={
                                                assigningWorker
                                            }
                                        >

                                            <MenuItem value="">
                                                <em>
                                                    Select a worker
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
                                                        —{" "}
                                                        {worker.email}
                                                    </MenuItem>
                                                )
                                            )}

                                        </Select>

                                    </FormControl>

                                    <Box className="officerComplaintDetails_workerActions">

                                        <Button
                                            variant="contained"
                                            startIcon={
                                                assigningWorker
                                                    ? <CircularProgress
                                                        size={16}
                                                        color="inherit"
                                                    />
                                                    : <AssignmentIndOutlined />
                                            }
                                            disabled={
                                                !selectedWorker ||
                                                assigningWorker
                                            }
                                            className="officerComplaintDetails_primaryButton"
                                            onClick={
                                                handleAssignWorker
                                            }
                                        >
                                            {assigningWorker
                                                ? "Assigning..."
                                                : "Assign Worker"}
                                        </Button>

                                    </Box>
                                </>
                            )}

                        </Box>
                    )}

                </Paper>
            )}

            {/* =====================================================
                RESOLVED INFO
            ===================================================== */}

            {isResolved && (
                <Paper
                    elevation={0}
                    className="officerComplaintDetails_successCard"
                >

                    <Box className="officerComplaintDetails_successIcon">
                        <CheckCircleOutlineRounded />
                    </Box>

                    <Box>
                        <Typography className="officerComplaintDetails_successTitle">
                            Complaint Resolved
                        </Typography>

                        <Typography className="officerComplaintDetails_successText">
                            This complaint has been successfully resolved by the assigned worker.
                        </Typography>
                    </Box>

                </Paper>
            )}

            {/* =====================================================
                WORKFLOW
            ===================================================== */}

            <Paper
                elevation={0}
                className="officerComplaintDetails_card"
            >

                <Box className="officerComplaintDetails_sectionHeader">

                    <Box className="officerComplaintDetails_sectionIcon">
                        <AccessTimeOutlined />
                    </Box>

                    <Box>
                        <Typography className="officerComplaintDetails_cardTitle">
                            Complaint Workflow
                        </Typography>

                        <Typography className="officerComplaintDetails_cardSubtitle">
                            Track the current progress of this complaint.
                        </Typography>
                    </Box>

                </Box>

                <Divider className="officerComplaintDetails_divider" />

                <Box className="officerComplaintDetails_workflow">

                    {/* ASSIGNED */}

                    <Box
                        className={`workflowStep ${isAssigned
                            ? "workflowStep_active"
                            : ""
                            }`}
                    >

                        <Box className="workflowDot">
                            {isAssigned
                                ? <CheckCircleOutlineRounded />
                                : "1"}
                        </Box>

                        <Typography>
                            Assigned
                        </Typography>

                    </Box>

                    <Box
                        className={`workflowLine ${isInProgress
                            ? "workflowLine_active"
                            : ""
                            }`}
                    />

                    {/* IN PROGRESS */}

                    <Box
                        className={`workflowStep ${isInProgress
                            ? "workflowStep_active"
                            : ""
                            }`}
                    >

                        <Box className="workflowDot">
                            {isInProgress
                                ? <CheckCircleOutlineRounded />
                                : "2"}
                        </Box>

                        <Typography>
                            In Progress
                        </Typography>

                    </Box>

                    <Box
                        className={`workflowLine ${isResolved
                            ? "workflowLine_active"
                            : ""
                            }`}
                    />

                    {/* RESOLVED */}

                    <Box
                        className={`workflowStep ${isResolved
                            ? "workflowStep_active"
                            : ""
                            }`}
                    >

                        <Box className="workflowDot">
                            {isResolved
                                ? <CheckCircleOutlineRounded />
                                : "3"}
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

            {isResolved && feedback && (
                <Paper
                    elevation={0}
                    className="officerComplaintDetails_card"
                >

                    <Box className="officerComplaintDetails_sectionHeader">

                        <Box className="officerComplaintDetails_sectionIcon officerComplaintDetails_feedbackIcon">
                            <Rating
                                value={feedback.rating}
                                readOnly
                                size="small"
                            />
                        </Box>

                        <Box>
                            <Typography className="officerComplaintDetails_cardTitle">
                                Citizen Feedback
                            </Typography>

                            <Typography className="officerComplaintDetails_cardSubtitle">
                                Feedback submitted after complaint resolution.
                            </Typography>
                        </Box>

                    </Box>

                    <Divider className="officerComplaintDetails_divider" />

                    <Box className="officerComplaintDetails_ratingSection">

                        <Typography className="officerComplaintDetails_label">
                            Rating
                        </Typography>

                        <Box className="officerComplaintDetails_ratingRow">

                            <Rating
                                value={
                                    feedback.rating
                                }
                                readOnly
                                precision={0.5}
                                size="medium"
                            />

                            <Typography className="officerComplaintDetails_ratingValue">
                                {feedback.rating}/5
                            </Typography>

                        </Box>

                    </Box>

                    <Box className="officerComplaintDetails_commentSection">

                        <Typography className="officerComplaintDetails_label">
                            Comment
                        </Typography>

                        <Box className="officerComplaintDetails_commentBox">

                            <Typography>
                                {feedback.comment ||
                                    "No comment provided."}
                            </Typography>

                        </Box>

                    </Box>

                    <Typography className="officerComplaintDetails_feedbackDate">
                        Submitted on{" "}
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