import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    CalendarTodayOutlined,
    CameraAltOutlined,
    CategoryOutlined,
    CheckCircle,
    Close,
    DescriptionOutlined,
    ImageOutlined,
    LocationOnOutlined,
    UploadFileOutlined,
    WorkOutlineOutlined,
} from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    completeWorkerComplaint,
    getWorkerComplaintById,
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
    images?: string[];
    completionImages?: string[];
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
    const [loading, setLoading] = useState(true);

    const [openCompletionDialog, setOpenCompletionDialog] = useState(false);
    const [completionImages, setCompletionImages] = useState<File[]>([]);
    const [completionPreviews, setCompletionPreviews] = useState<string[]>([]);
    const [completionError, setCompletionError] = useState("");
    const [isCompleting, setIsCompleting] = useState(false);

    const cameraInputRef = useRef<HTMLInputElement>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const clearCompletionImages = () => {
        completionPreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setCompletionImages([]);
        setCompletionPreviews([]);
    };

    const handleOpenCompletionDialog = () => {
        clearCompletionImages();
        setCompletionError("");
        setOpenCompletionDialog(true);
    };

    const handleCloseCompletionDialog = () => {
        if (isCompleting) return;

        clearCompletionImages();
        setCompletionError("");
        setOpenCompletionDialog(false);
    };

    const handleCompletionImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) return;

        const invalidFiles = files.filter(
            (file) => !file.type.startsWith("image/")
        );

        if (invalidFiles.length > 0) {
            setCompletionError("Only image files are allowed.");
            event.target.value = "";
            return;
        }

        const totalImages = completionImages.length + files.length;

        if (totalImages > 5) {
            setCompletionError("You can upload a maximum of 5 images.");
            event.target.value = "";
            return;
        }

        const newPreviews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setCompletionImages((prev) => [...prev, ...files]);
        setCompletionPreviews((prev) => [...prev, ...newPreviews]);
        setCompletionError("");

        event.target.value = "";
    };

    const handleRemoveCompletionImage = (index: number) => {
        const preview = completionPreviews[index];

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setCompletionImages((prev) =>
            prev.filter((_, imageIndex) => imageIndex !== index)
        );

        setCompletionPreviews((prev) =>
            prev.filter((_, imageIndex) => imageIndex !== index)
        );
    };

    const handleCompleteComplaint = async () => {
        if (!id) return;

        if (completionImages.length === 0) {
            setCompletionError(
                "Please add at least one photo of the completed work."
            );
            return;
        }

        try {
            setIsCompleting(true);
            setCompletionError("");

            const response = await completeWorkerComplaint(
                id,
                completionImages
            );

            setComplaint(response.complaint);

            clearCompletionImages();
            setOpenCompletionDialog(false);
        } catch (error: unknown) {
            console.error("Complete complaint error:", error);

            const message =
                error &&
                    typeof error === "object" &&
                    "response" in error &&
                    error.response &&
                    typeof error.response === "object" &&
                    "data" in error.response &&
                    error.response.data &&
                    typeof error.response.data === "object" &&
                    "message" in error.response.data &&
                    typeof error.response.data.message === "string"
                    ? error.response.data.message
                    : "Failed to complete complaint.";

            setCompletionError(message);
        } finally {
            setIsCompleting(false);
        }
    };

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

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

    useEffect(() => {
        return () => {
            completionPreviews.forEach((preview) => {
                URL.revokeObjectURL(preview);
            });
        };
    }, [completionPreviews]);

    if (loading) {
        return (
            <Box className="workerComplaintDetails_loading">
                <Box className="workerComplaintDetails_loader" />
                <Typography>Loading complaint...</Typography>
            </Box>
        );
    }

    if (!complaint) {
        return (
            <Box className="workerComplaintDetails_empty">
                <Box className="workerComplaintDetails_emptyIcon">
                    <DescriptionOutlined />
                </Box>

                <Typography className="workerComplaintDetails_emptyTitle">
                    Complaint not found
                </Typography>

                <Typography className="workerComplaintDetails_emptyText">
                    The complaint may have been removed or is no longer
                    available.
                </Typography>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/worker/dashboard")}
                    className="workerComplaintDetails_emptyButton"
                >
                    Back to Complaints
                </Button>
            </Box>
        );
    }

    const isCompleted = complaint.status === "resolved";

    return (
        <Box className="workerComplaintDetails">
            {/* Header */}
            <Box className="workerComplaintDetails_header">
                <Button
                    className="workerComplaintDetails_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/worker/dashboard")}
                >
                    Back to Complaints
                </Button>

                <Box className="workerComplaintDetails_pageHeading">
                    <Box>
                        <Typography className="workerComplaintDetails_title">
                            Complaint Details
                        </Typography>

                        <Typography className="workerComplaintDetails_subtitle">
                            Review the assigned complaint and manage the
                            assigned work.
                        </Typography>
                    </Box>

                    <Chip
                        label={getStatusLabel(complaint.status)}
                        className={`workerStatus workerStatus_${complaint.status}`}
                    />
                </Box>
            </Box>

            {/* Complaint Information */}
            <Paper
                elevation={0}
                className="workerComplaintDetails_card"
            >
                <Box className="workerComplaintDetails_cardHeader">
                    <Box className="workerComplaintDetails_sectionHeading">
                        <Box className="workerComplaintDetails_sectionIcon">
                            <DescriptionOutlined />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_cardTitle">
                                Complaint Information
                            </Typography>

                            <Typography className="workerComplaintDetails_cardSubtitle">
                                Details of the complaint assigned to you.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className="workerComplaintDetails_field workerComplaintDetails_titleField">
                    <Box className="workerComplaintDetails_icon">
                        <DescriptionOutlined />
                    </Box>

                    <Box className="workerComplaintDetails_fieldContent">
                        <Typography className="workerComplaintDetails_label">
                            Complaint Title
                        </Typography>

                        <Typography className="workerComplaintDetails_value">
                            {complaint.title}
                        </Typography>
                    </Box>
                </Box>

                <Box className="workerComplaintDetails_field workerComplaintDetails_descriptionField">
                    <Box className="workerComplaintDetails_icon">
                        <DescriptionOutlined />
                    </Box>

                    <Box className="workerComplaintDetails_fieldContent">
                        <Typography className="workerComplaintDetails_label">
                            Description
                        </Typography>

                        <Typography className="workerComplaintDetails_description">
                            {complaint.description}
                        </Typography>
                    </Box>
                </Box>

                <Box className="workerComplaintDetails_grid">
                    <Box className="workerComplaintDetails_field">
                        <Box className="workerComplaintDetails_icon">
                            <CategoryOutlined />
                        </Box>

                        <Box className="workerComplaintDetails_fieldContent">
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

                        <Box className="workerComplaintDetails_fieldContent">
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

                <Box className="workerComplaintDetails_location">
                    <Box className="workerComplaintDetails_icon">
                        <LocationOnOutlined />
                    </Box>

                    <Box className="workerComplaintDetails_fieldContent">
                        <Typography className="workerComplaintDetails_label">
                            Complaint Location
                        </Typography>

                        <Typography className="workerComplaintDetails_value">
                            {complaint.location?.address || "N/A"}
                        </Typography>
                    </Box>
                </Box>

                {/* Action */}
                {complaint.status === "in_progress" && (
                    <Box className="workerComplaintDetails_actionArea">
                        <Box className="workerComplaintDetails_workingMessage">
                            <Box className="workerComplaintDetails_workingIcon">
                                <WorkOutlineOutlined />
                            </Box>

                            <Box>
                                <Typography className="workerComplaintDetails_workingTitle">
                                    Work in progress
                                </Typography>

                                <Typography className="workerComplaintDetails_workingText">
                                    Complete the assigned work and upload
                                    photos as proof of completion.
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            className="workerComplaintDetails_completeButton"
                            onClick={handleOpenCompletionDialog}
                        >
                            Mark as Completed
                        </Button>
                    </Box>
                )}

                {isCompleted && (
                    <Box className="workerComplaintDetails_completedBanner">
                        <Box className="workerComplaintDetails_completedIcon">
                            <CheckCircle />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_completedTitle">
                                Complaint Completed
                            </Typography>

                            <Typography className="workerComplaintDetails_completedText">
                                The complaint has been successfully resolved
                                and completion proof has been submitted.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Workflow */}
            <Paper
                elevation={0}
                className="workerComplaintDetails_card"
            >
                <Box className="workerComplaintDetails_cardHeader">
                    <Box className="workerComplaintDetails_sectionHeading">
                        <Box className="workerComplaintDetails_sectionIcon">
                            <WorkOutlineOutlined />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_cardTitle">
                                Complaint Workflow
                            </Typography>

                            <Typography className="workerComplaintDetails_cardSubtitle">
                                Current progress of this complaint.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className="workerComplaintDetails_workflow">
                    <Box
                        className={`workflowStep ${complaint.status === "assigned" ||
                            complaint.status === "in_progress" ||
                            complaint.status === "resolved"
                            ? "workflowStep_active"
                            : ""
                            }`}
                    >
                        <Box className="workflowDot">
                            1
                        </Box>

                        <Typography>Assigned</Typography>
                    </Box>

                    <Box
                        className={`workflowLine ${complaint.status === "in_progress" ||
                            complaint.status === "resolved"
                            ? "workflowLine_active"
                            : ""
                            }`}
                    />

                    <Box
                        className={`workflowStep ${complaint.status === "in_progress" ||
                            complaint.status === "resolved"
                            ? "workflowStep_active"
                            : ""
                            }`}
                    >
                        <Box className="workflowDot">
                            2
                        </Box>

                        <Typography>In Progress</Typography>
                    </Box>

                    <Box
                        className={`workflowLine ${complaint.status === "resolved"
                            ? "workflowLine_active"
                            : ""
                            }`}
                    />

                    <Box
                        className={`workflowStep ${complaint.status === "resolved"
                            ? "workflowStep_active"
                            : ""
                            }`}
                    >
                        <Box className="workflowDot">
                            3
                        </Box>

                        <Typography>Completed</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Status History */}
            <Paper
                elevation={0}
                className="workerComplaintDetails_card"
            >
                <Box className="workerComplaintDetails_cardHeader">
                    <Box className="workerComplaintDetails_sectionHeading">
                        <Box className="workerComplaintDetails_sectionIcon">
                            <CalendarTodayOutlined />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_cardTitle">
                                Status History
                            </Typography>

                            <Typography className="workerComplaintDetails_cardSubtitle">
                                Activity and status changes for this complaint.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

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
                                <Box
                                    className={`historyIcon historyIcon_${history.status}`}
                                >
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

            {/* Completion Dialog */}
            <Dialog
                open={openCompletionDialog}
                onClose={handleCloseCompletionDialog}
                fullWidth
                maxWidth="sm"
                className="workerComplaintDetails_completionDialog"
            >
                <DialogTitle className="workerComplaintDetails_dialogHeader">
                    <Box>
                        <Box className="workerComplaintDetails_dialogIcon">
                            <CheckCircle />
                        </Box>

                        <Box>
                            <Typography className="workerComplaintDetails_dialogTitle">
                                Complete Complaint
                            </Typography>

                            <Typography className="workerComplaintDetails_dialogSubtitle">
                                Upload proof of the completed work
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={handleCloseCompletionDialog}
                        disabled={isCompleting}
                        className="workerComplaintDetails_dialogClose"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="workerComplaintDetails_dialogContent">
                    <Box className="workerComplaintDetails_uploadNotice">
                        <ImageOutlined />

                        <Box>
                            <Typography>
                                Completion photos are required
                            </Typography>

                            <span>
                                Add at least 1 photo and up to 5 photos showing
                                the completed work.
                            </span>
                        </Box>
                    </Box>

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        hidden
                        ref={cameraInputRef}
                        onChange={handleCompletionImageChange}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        ref={uploadInputRef}
                        onChange={handleCompletionImageChange}
                    />

                    <Box className="workerComplaintDetails_uploadOptions">
                        <Button
                            className="workerComplaintDetails_uploadOption"
                            onClick={() =>
                                cameraInputRef.current?.click()
                            }
                            disabled={isCompleting}
                        >
                            <Box className="uploadOptionIcon">
                                <CameraAltOutlined />
                            </Box>

                            <Box>
                                <Typography>Take Photo</Typography>
                                <span>Use your camera</span>
                            </Box>
                        </Button>

                        <Button
                            className="workerComplaintDetails_uploadOption"
                            onClick={() =>
                                uploadInputRef.current?.click()
                            }
                            disabled={isCompleting}
                        >
                            <Box className="uploadOptionIcon">
                                <UploadFileOutlined />
                            </Box>

                            <Box>
                                <Typography>Upload Files</Typography>
                                <span>Choose from device</span>
                            </Box>
                        </Button>
                    </Box>

                    {completionPreviews.length > 0 && (
                        <Box className="workerComplaintDetails_previewSection">
                            <Box className="workerComplaintDetails_previewHeader">
                                <Typography>
                                    Completion Photos
                                </Typography>

                                <span>
                                    {completionPreviews.length}/5
                                </span>
                            </Box>

                            <Box className="workerComplaintDetails_previewGrid">
                                {completionPreviews.map(
                                    (preview, index) => (
                                        <Box
                                            key={preview}
                                            className="workerComplaintDetails_previewItem"
                                        >
                                            <Box
                                                component="img"
                                                src={preview}
                                                alt={`Completion proof ${index + 1
                                                    }`}
                                            />

                                            <Box className="previewNumber">
                                                {index + 1}
                                            </Box>

                                            <IconButton
                                                onClick={() =>
                                                    handleRemoveCompletionImage(
                                                        index
                                                    )
                                                }
                                                disabled={isCompleting}
                                                className="previewRemoveButton"
                                            >
                                                <Close />
                                            </IconButton>
                                        </Box>
                                    )
                                )}
                            </Box>
                        </Box>
                    )}

                    {completionPreviews.length === 0 && (
                        <Box className="workerComplaintDetails_emptyUpload">
                            <ImageOutlined />

                            <Typography>
                                No photos selected yet
                            </Typography>

                            <span>
                                Upload photos using one of the options above.
                            </span>
                        </Box>
                    )}

                    {completionError && (
                        <Box className="workerComplaintDetails_error">
                            <Typography>
                                {completionError}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions className="workerComplaintDetails_dialogActions">
                    <Button
                        onClick={handleCloseCompletionDialog}
                        disabled={isCompleting}
                        className="dialogCancelButton"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            isCompleting ? undefined : <CheckCircle />
                        }
                        onClick={handleCompleteComplaint}
                        disabled={
                            completionImages.length === 0 ||
                            isCompleting
                        }
                        className="dialogConfirmButton"
                    >
                        {isCompleting
                            ? "Submitting..."
                            : "Submit & Complete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkerComplaintDetails;