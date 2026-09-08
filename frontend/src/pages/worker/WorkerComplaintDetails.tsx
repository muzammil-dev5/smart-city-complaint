import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Typography,
} from "@mui/material";
import {
    ArrowBack,
    CalendarTodayOutlined,
    CameraAltOutlined,
    CategoryOutlined,
    CheckCircle,
    DescriptionOutlined,
    LocationOnOutlined,
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

                <Box className="workerComplaintDetails_field workerComplaintDetails_descriptionField">
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

                {complaint.status === "in_progress" && (
                    <>
                        <Box className="workerComplaintDetails_actions">
                            <Button
                                variant="contained"
                                startIcon={<CheckCircle />}
                                className="workerComplaintDetails_completeButton"
                                onClick={handleOpenCompletionDialog}
                            >
                                Mark Completed
                            </Button>
                        </Box>

                        <Box className="workerComplaintDetails_infoMessage">
                            <WorkOutlineOutlined />

                            <Typography>
                                You are currently working on this complaint.
                                Mark it as completed once the work has been finished.
                            </Typography>
                        </Box>
                    </>
                )}
            </Paper>

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

                        <Typography>
                            Assigned
                        </Typography>
                    </Box>

                    <Box className="workflowLine" />

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

                        <Typography>
                            In Progress
                        </Typography>
                    </Box>

                    <Box className="workflowLine" />

                    <Box
                        className={`workflowStep ${complaint.status === "resolved"
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

            <Dialog
                open={openCompletionDialog}
                onClose={handleCloseCompletionDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Complete Complaint
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Upload at least one photo showing the completed work.
                        This proof will be shared with the citizen.
                    </DialogContentText>

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

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<CameraAltOutlined />}
                            onClick={() =>
                                cameraInputRef.current?.click()
                            }
                            disabled={isCompleting}
                        >
                            Take Photo
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<DescriptionOutlined />}
                            onClick={() =>
                                uploadInputRef.current?.click()
                            }
                            disabled={isCompleting}
                        >
                            Upload Files
                        </Button>
                    </Box>

                    {completionPreviews.length > 0 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: 2,
                            }}
                        >
                            {completionPreviews.map(
                                (preview, index) => (
                                    <Box
                                        key={preview}
                                        sx={{
                                            position: "relative",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={preview}
                                            alt={`Completion proof ${index + 1}`}
                                            sx={{
                                                width: "100%",
                                                height: 180,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                                display: "block",
                                            }}
                                        />

                                        <Button
                                            size="small"
                                            color="error"
                                            variant="contained"
                                            onClick={() =>
                                                handleRemoveCompletionImage(
                                                    index
                                                )
                                            }
                                            disabled={isCompleting}
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                minWidth: "auto",
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                )
                            )}
                        </Box>
                    )}

                    {completionError && (
                        <Typography
                            color="error"
                            sx={{ mt: 2 }}
                        >
                            {completionError}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseCompletionDialog}
                        disabled={isCompleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<CheckCircle />}
                        onClick={handleCompleteComplaint}
                        disabled={
                            completionImages.length === 0 ||
                            isCompleting
                        }
                    >
                        {isCompleting
                            ? "Uploading..."
                            : "Submit & Complete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkerComplaintDetails;