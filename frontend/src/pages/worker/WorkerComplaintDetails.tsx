import {
    Box,
    Chip,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {
    ArrowBack,
    CalendarTodayOutlined,
    CategoryOutlined,
    DescriptionOutlined,
    LocationOnOutlined,
    CheckCircle,
    WorkOutlineOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getWorkerComplaintById,
    updateWorkerComplaintStatus,
} from "../../services/complaintService";
import "./WorkerComplaintDetails.scss";

type StatusHistory = {
    status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "rejected";
    changedAt: string;
};

type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "rejected";
    createdAt: string;
    location?: {
        address: string;
        latitude?: number;
        longitude?: number;
    };
    statusHistory: StatusHistory[];
};

const getStatusLabel = (status: Complaint["status"]) => {
    switch (status) {
        case "in_progress":
            return "In Progress";

        case "assigned":
            return "Assigned";

        case "resolved":
            return "Completed";

        case "rejected":
            return "Rejected";

        default:
            return "Pending";
    }
};

const WorkerComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const handleOpenStatusDialog = (status: string) => {
        setSelectedStatus(status);
        setOpenStatusDialog(true);
    };

    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false);
        setSelectedStatus(null);
    };

    const handleStatusUpdate = async (status: string) => {
        if (!id) return;

        try {
            const response = await updateWorkerComplaintStatus(id, status);

            setComplaint(response.complaint);
            handleCloseStatusDialog();
        } catch (error) {
            console.error("Worker status update error:", error);
        }
    };

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;

            try {
                const response = await getWorkerComplaintById(id);

                setComplaint(response.complaint);
            } catch (error) {
                console.error(
                    "Failed to fetch worker complaint:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    if (loading) {
        return (
            <Box className="workerComplaintDetails_loading">
                <Typography>
                    Loading complaint...
                </Typography>
            </Box>
        );
    }

    if (!complaint) {
        return (
            <Box className="workerComplaintDetails_empty">
                <Typography>
                    Complaint not found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="workerComplaintDetails">

            {/* Page Header */}
            <Box className="workerComplaintDetails_header">

                <Button
                    className="workerComplaintDetails_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/worker/dashboard")}
                >
                    Back to Complaints
                </Button>

                <Typography className="workerComplaintDetails_title">
                    Complaint Details
                </Typography>

                <Typography className="workerComplaintDetails_subtitle">
                    Review the assigned complaint and complete the assigned work.
                </Typography>
            </Box>


            {/* Complaint Information */}
            <Paper
                elevation={0}
                className="workerComplaintDetails_card"
            >

                <Box className="workerComplaintDetails_cardHeader">

                    <Box>
                        <Typography className="workerComplaintDetails_cardTitle">
                            Complaint Information
                        </Typography>

                        <Typography className="workerComplaintDetails_cardSubtitle">
                            Details of the complaint assigned to you.
                        </Typography>
                    </Box>

                    <Chip
                        label={getStatusLabel(complaint.status)}
                        className={`workerStatus workerStatus_${complaint.status}`}
                    />

                </Box>


                {/* Complaint Title */}
                <Box className="workerComplaintDetails_field">

                    <Box className="workerComplaintDetails_icon">
                        <DescriptionOutlined />
                    </Box>

                    <Box>
                        <Typography className="workerComplaintDetails_label">
                            Complaint Title
                        </Typography>

                        <Typography className="workerComplaintDetails_value">
                            {complaint.title}
                        </Typography>
                    </Box>

                </Box>


                {/* Description */}
                <Box
                    className="
                        workerComplaintDetails_field
                        workerComplaintDetails_descriptionField
                    "
                >

                    <Box className="workerComplaintDetails_icon">
                        <DescriptionOutlined />
                    </Box>

                    <Box>
                        <Typography className="workerComplaintDetails_label">
                            Description
                        </Typography>

                        <Typography className="workerComplaintDetails_description">
                            {complaint.description}
                        </Typography>
                    </Box>

                </Box>


                {/* Category + Date */}
                <Box className="workerComplaintDetails_grid">

                    <Box className="workerComplaintDetails_field">

                        <Box className="workerComplaintDetails_icon">
                            <CategoryOutlined />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_label">
                                Category
                            </Typography>

                            <Typography className="workerComplaintDetails_value">
                                {complaint.category}
                            </Typography>
                        </Box>

                    </Box>


                    <Box className="workerComplaintDetails_field">

                        <Box className="workerComplaintDetails_icon">
                            <CalendarTodayOutlined />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_label">
                                Submitted Date
                            </Typography>

                            <Typography className="workerComplaintDetails_value">
                                {new Date(
                                    complaint.createdAt
                                ).toLocaleString()}
                            </Typography>
                        </Box>

                    </Box>

                </Box>


                {/* Location */}
                <Box className="workerComplaintDetails_location">

                    <Box className="workerComplaintDetails_icon">
                        <LocationOnOutlined />
                    </Box>

                    <Box>
                        <Typography className="workerComplaintDetails_label">
                            Complaint Location
                        </Typography>

                        <Typography className="workerComplaintDetails_value">
                            {complaint.location?.address || "N/A"}
                        </Typography>
                    </Box>

                </Box>


                {/* Worker Action */}
                {complaint.status === "in_progress" && (
                    <Box className="workerComplaintDetails_actions">

                        <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            className="workerComplaintDetails_completeButton"
                            onClick={() =>
                                handleOpenStatusDialog("resolved")
                            }
                        >
                            Mark Completed
                        </Button>

                    </Box>
                )}


                {/* In Progress Message */}
                {complaint.status === "in_progress" && (
                    <Box className="workerComplaintDetails_infoMessage">

                        <WorkOutlineOutlined />

                        <Typography>
                            You are currently working on this complaint.
                            Mark it as completed once the work has been finished.
                        </Typography>

                    </Box>
                )}

            </Paper>


            {/* Workflow */}
            <Paper
                elevation={0}
                className="workerComplaintDetails_card"
            >

                <Typography className="workerComplaintDetails_cardTitle">
                    Complaint Workflow
                </Typography>

                <Typography className="workerComplaintDetails_cardSubtitle">
                    Current progress of this complaint.
                </Typography>


                <Box className="workerComplaintDetails_workflow">

                    <Box
                        className={`workflowStep ${
                            complaint.status === "assigned" ||
                            complaint.status === "in_progress" ||
                            complaint.status === "resolved"
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
                        className={`workflowStep ${
                            complaint.status === "in_progress" ||
                            complaint.status === "resolved"
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
                        className={`workflowStep ${
                            complaint.status === "resolved"
                                ? "workflowStep_active"
                                : ""
                        }`}
                    >
                        <Box className="workflowDot">
                            3
                        </Box>

                        <Typography>
                            Completed
                        </Typography>
                    </Box>

                </Box>

            </Paper>


            {/* Status History */}
            <Paper
                elevation={0}
                className="workerComplaintDetails_card"
            >

                <Typography className="workerComplaintDetails_cardTitle">
                    Status History
                </Typography>

                <Typography className="workerComplaintDetails_cardSubtitle">
                    Activity and status changes for this complaint.
                </Typography>


                <Box className="workerComplaintDetails_history">

                    {complaint.statusHistory.length === 0 ? (
                        <Typography className="workerComplaintDetails_emptyHistory">
                            No status history available.
                        </Typography>
                    ) : (
                        complaint.statusHistory.map((history, index) => (

                            <Box
                                key={`${history.status}-${history.changedAt}`}
                                className="historyItem"
                            >

                                <Box className="historyIcon">
                                    <CheckCircle />
                                </Box>

                                <Box className="historyContent">

                                    <Typography className="historyStatus">
                                        {getStatusLabel(history.status)}
                                    </Typography>

                                    <Typography className="historyDate">
                                        {new Date(
                                            history.changedAt
                                        ).toLocaleString()}
                                    </Typography>

                                </Box>

                                {index !==
                                    complaint.statusHistory.length - 1 && (
                                    <Box className="historyLine" />
                                )}

                            </Box>

                        ))
                    )}

                </Box>

            </Paper>


            {/* Confirmation Dialog */}
            <Dialog
                open={openStatusDialog}
                onClose={handleCloseStatusDialog}
                className="workerComplaintDetails_dialog"
            >

                <DialogTitle>
                    {selectedStatus === "in_progress"
                        ? "Start Work"
                        : "Mark Completed"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>
                        Are you sure you want to{" "}
                        {selectedStatus === "in_progress"
                            ? "start working on this complaint?"
                            : "mark this complaint as completed?"}
                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={handleCloseStatusDialog}
                        className="dialogCancelButton"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        className="dialogConfirmButton"
                        onClick={() => {
                            if (selectedStatus) {
                                handleStatusUpdate(selectedStatus);
                            }
                        }}
                    >
                        {selectedStatus === "in_progress"
                            ? "Start Work"
                            : "Mark Completed"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};

export default WorkerComplaintDetails;