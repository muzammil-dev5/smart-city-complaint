import { Box, Chip, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Rating, TextField } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getComplaintById, deleteComplaint, updateComplaintStatus, getComplaintActivities } from "../../services/complaintService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Complaint } from "../../types/user";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { createFeedback, getComplaintFeedback } from "../../services/feedbackService";
import "./ComplaintDetails.scss";
import {
    ArrowBack,
    CalendarTodayOutlined,
    CategoryOutlined,
    // DeleteOutline,
    EditOutlined,
    DescriptionOutlined,
    PlayArrow,
    PlaylistAddTwoTone,
    Close,
    // CheckCircleOutline,
} from "@mui/icons-material";

type ComplaintActivity = {
    _id: string;
    action: string;
    role: string;
    performedBy: {
        _id: string;
        name: string;
        role: string;
    };
    createdAt: string;
};

const formatActivityAction = (action: string) => {
    return action
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getActivityIcon = (action: string) => {
    switch (action) {
        case "complaint_created":
            return <AssignmentOutlinedIcon fontSize="small" />;

        case "complaint_assigned":
            return <PersonAddAltOutlinedIcon fontSize="small" />;

        case "worker_assigned":
            return <EngineeringOutlinedIcon fontSize="small" />;

        case "complaint_started":
            return <PlayArrowIcon fontSize="small" />;

        case "complaint_resolved":
            return <CheckCircleIcon fontSize="small" />;

        default:
            return <NotificationsIcon fontSize="small" />;
    }
};

const ComplaintDetails = () => {
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [activities, setActivities] = useState<ComplaintActivity[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState<number | null>(0);
    const [feedbackComment, setFeedbackComment] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedback, setFeedback] = useState<{
        rating: number;
        comment?: string;
        createdAt: string;
    } | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;

            try {
                const response = await getComplaintById(id);
                setComplaint(response.complaint);

                const activityResponse =
                    await getComplaintActivities(id);

                setActivities(activityResponse.activities);

                try {
                    const feedbackResponse = await getComplaintFeedback(id);

                    if (feedbackResponse.feedback) {
                        setFeedback(feedbackResponse.feedback); 
                        setFeedbackSubmitted(true);
                    } else {
                        setFeedbackSubmitted(false);
                    }

                } catch (error: unknown) {
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        setFeedbackSubmitted(false);
                    } else {
                        console.error("Get feedback error:", error);
                    }
                }

            } catch (error) {
                console.error(
                    "Failed to fetch complaint:",
                    error
                );
            }
        };

        fetchComplaint();
    }, [id]);

    // Delete Complaint and dialog method
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleDelete = async () => {
        if (!id) return;

        try {
            await deleteComplaint(id);
            setOpenDeleteDialog(false);
            navigate("/citizen/complaints");

        } catch (error) {
            console.error("Delete complaint error:", error);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        if (!id) return;

        try {
            const response = await updateComplaintStatus(
                id,
                status
            );

            setComplaint(response.complaint);

        } catch (error) {
            console.error(
                "Status update error:",
                error
            );
        }
    };

    const handleSubmitFeedback = async () => {
        if (!id || !feedbackRating) return;

        try {
            const response = await createFeedback({
                complaintId: id,
                rating: feedbackRating,
                comment: feedbackComment
            });

            setFeedback(response.feedback);
            setFeedbackSubmitted(true);
            setOpenFeedbackDialog(false);

        } catch (error) {
            console.error(
                "Submit feedback error:",
                error
            );
        }
    };

    if (!complaint) {
        return (
            <Typography>
                Loading complaint...
            </Typography>
        );
    }

    return (
        <Box className="complaintDetails">
            <Box className="complaintDetails_header">
                <Button
                    className="complaintDetails_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/citizen/complaints")}>
                    Back to Complaints
                </Button>

                <Typography className="complaintDetails_title">
                    Complaint Details
                </Typography>

                <Typography className="complaintDetails_subtitle">
                    View complaint information and track its progress
                </Typography>
            </Box>

            <Paper
                elevation={0}
                className="complaintDetails_card complaintDetails_information">

                <Box className="complaintDetails_cardHeader">
                    <Box>
                        <Typography className="complaintDetails_cardTitle">
                            Complaint Information
                        </Typography>

                        <Typography className="complaintDetails_cardSubtitle">
                            Details of your submitted complaint
                        </Typography>
                    </Box>

                    <Chip
                        label={
                            complaint.status === "in_progress"
                                ? "In Progress"
                                : complaint.status.charAt(0).toUpperCase() +
                                complaint.status.slice(1)
                        }
                        className={`complaintStatus complaintStatus_${complaint.status}`}
                    />
                </Box>

                <Box className="complaintDetails_field complaintDetails_fieldFull">
                    <Box className="complaintDetails_fieldIcon">
                        <DescriptionOutlined />
                    </Box>

                    <Box className="complaintDetails_fieldContent">
                        <Typography className="complaintDetails_label">
                            Title
                        </Typography>

                        <Typography className="complaintDetails_value">
                            {complaint.title}
                        </Typography>
                    </Box>
                </Box>

                <Box className="complaintDetails_field complaintDetails_fieldFull">
                    <Box className="complaintDetails_fieldIcon">
                        <DescriptionOutlined />
                    </Box>

                    <Box className="complaintDetails_fieldContent">
                        <Typography className="complaintDetails_label">
                            Description
                        </Typography>

                        <Typography className="complaintDetails_description">
                            {complaint.description}
                        </Typography>
                    </Box>
                </Box>

                {complaint.images && complaint.images.length > 0 && (
                    <Box className="complaintDetails_imagesSection">
                        <Typography className="complaintDetails_label">
                            Before — Reported Images
                        </Typography>

                        <Typography className="complaintDetails_imageDescription">
                            Images submitted when the complaint was reported.
                        </Typography>

                        <Box className="complaintDetails_images">
                            {complaint.images.map((image, index) => (
                                <Box
                                    key={image}
                                    className="complaintDetails_imageWrapper"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img
                                        src={image}
                                        alt={`Reported complaint ${index + 1}`}
                                        className="complaintDetails_image"
                                    />

                                    <Box className="complaintDetails_imageBadge">
                                        Before
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {complaint.completionImages &&
                    complaint.completionImages.length > 0 && (
                        <Box className="complaintDetails_imagesSection complaintDetails_completionSection">
                            <Typography className="complaintDetails_label">
                                After — Completed Work
                            </Typography>

                            <Typography className="complaintDetails_imageDescription">
                                Photos uploaded by the worker after completing the work.
                            </Typography>

                            <Box className="complaintDetails_images">
                                {complaint.completionImages.map((image, index) => (
                                    <Box
                                        key={image}
                                        className="complaintDetails_imageWrapper complaintDetails_completionImageWrapper"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Completed work ${index + 1}`}
                                            className="complaintDetails_image"
                                        />

                                        <Box className="complaintDetails_imageBadge complaintDetails_afterBadge">
                                            After
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                <Box className="complaintDetails_grid">
                    <Box className="complaintDetails_field">
                        <Box className="complaintDetails_fieldIcon">
                            <CategoryOutlined />
                        </Box>

                        <Box className="complaintDetails_fieldContent">
                            <Typography className="complaintDetails_label">
                                Category
                            </Typography>

                            <Typography className="complaintDetails_value">
                                {complaint.category}
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="complaintDetails_field">
                        <Box className="complaintDetails_fieldIcon">
                            <CalendarTodayOutlined />
                        </Box>

                        <Box className="complaintDetails_fieldContent">
                            <Typography className="complaintDetails_label">
                                Submitted Date
                            </Typography>

                            <Typography className="complaintDetails_value">
                                {new Date(
                                    complaint.createdAt
                                ).toLocaleDateString()}
                            </Typography>
                        </Box>

                        {user?.role === "citizen" &&
                            complaint.status === "resolved" && (

                                feedbackSubmitted ? (
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={() => setOpenFeedbackDialog(true)}
                                    >
                                        View Feedback
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            setOpenFeedbackDialog(true)
                                        }
                                    >
                                        Give Feedback
                                    </Button>
                                )
                            )}

                    </Box>

                </Box>

                {role === "citizen" && (
                    <Box className="complaintDetails_actions">

                        <Button
                            variant="contained"
                            startIcon={<EditOutlined />}
                            className="complaintDetails_editButton"
                            onClick={() =>
                                navigate(
                                    `/citizen/complaints/${complaint._id}/edit`
                                )}>
                            Edit Complaint
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<PlaylistAddTwoTone />}
                            className="complaintDetails_deleteButton"
                            onClick={handleOpenDeleteDialog}>
                            Delete Complaint
                        </Button>
                    </Box>
                )}

                {role === "officer" && (
                    <Box className="complaintDetails_actions">

                        {complaint.status === "pending" && (
                            <Button
                                variant="contained"
                                startIcon={<PlayArrow />}
                                onClick={() =>
                                    handleStatusUpdate("in_progress")}>
                                Start Progress
                            </Button>
                        )}

                        {complaint.status === "in_progress" && (
                            <Button
                                variant="contained"
                                startIcon={<PlaylistAddTwoTone />}
                                onClick={() =>
                                    handleStatusUpdate("resolved")
                                }>
                                Mark Resolved
                            </Button>
                        )}

                    </Box>
                )}
            </Paper>

            <Paper
                elevation={0}
                className="complaintDetails_card">

                <Box className="complaintDetails_sectionHeader">
                    <Box>
                        <Typography className="complaintDetails_cardTitle">
                            Status History
                        </Typography>

                        <Typography className="complaintDetails_cardSubtitle">
                            Track the progress of your complaint
                        </Typography>
                    </Box>
                </Box>


                <Timeline className="complaintDetails_timeline">
                    {complaint.statusHistory.map((history, index) => (
                        <TimelineItem
                            key={`${history.status}-${history.changedAt}`}>

                            <TimelineSeparator>
                                <TimelineDot
                                    className={
                                        history.status === "resolved"
                                            ? "timelineDot_resolved"
                                            : "timelineDot_default"} />

                                {index <
                                    complaint.statusHistory.length - 1 && (
                                        <TimelineConnector />
                                    )}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography className="timeline_title">
                                    {history.status === "in_progress"
                                        ? "In Progress"
                                        : history.status.charAt(0).toUpperCase() +
                                        history.status.slice(1)}
                                </Typography>

                                <Typography className="timeline_date">
                                    {new Date(
                                        history.changedAt
                                    ).toLocaleString()}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Paper>

            <Paper
                elevation={0}
                className="complaintDetails_card">

                <Box className="complaintDetails_sectionHeader">
                    <Box>
                        <Typography className="complaintDetails_cardTitle">
                            Activity History
                        </Typography>

                        <Typography className="complaintDetails_cardSubtitle">
                            Recent actions performed on this complaint
                        </Typography>
                    </Box>
                </Box>

                {activities.length === 0 ? (
                    <Box className="complaintDetails_empty">
                        <Typography>
                            No activity found.
                        </Typography>
                    </Box>
                ) : (
                    <Timeline className="complaintDetails_timeline">
                        {activities.map((activity, index) => (
                            <TimelineItem key={activity._id}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        className={
                                            activity.action ===
                                                "complaint_resolved"
                                                ? "activityDot_resolved"
                                                : activity.action ===
                                                    "complaint_started"
                                                    ? "activityDot_started"
                                                    : "activityDot_default"}>
                                        {getActivityIcon(activity.action)}
                                    </TimelineDot>
                                    {index < activities.length - 1 && (
                                        <TimelineConnector />
                                    )}

                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography className="timeline_title">
                                        {formatActivityAction(
                                            activity.action
                                        )}
                                    </Typography>

                                    <Typography className="timeline_by">
                                        By:{" "}
                                        <strong>
                                            {activity.performedBy?.name ||
                                                "System"}
                                        </strong>

                                        {activity.performedBy?.role &&
                                            ` (${activity.performedBy.role})`}
                                    </Typography>

                                    <Typography className="timeline_date">
                                        {new Date(
                                            activity.createdAt
                                        ).toLocaleString()}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )}
            </Paper>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                className="deleteComplaintDialog">
                <DialogTitle className="deleteComplaintDialog_title">

                    <Box className="deleteComplaintDialog_icon">
                        <WarningAmberRoundedIcon />
                    </Box>

                    <Box>
                        <Typography className="deleteComplaintDialog_heading">
                            Delete Complaint
                        </Typography>

                        <Typography className="deleteComplaintDialog_subtitle">
                            This action requires confirmation
                        </Typography>
                    </Box>

                </DialogTitle>
                <DialogContent className="deleteComplaintDialog_content">
                    <DialogContentText className="deleteComplaintDialog_message">
                        Are you sure you want to delete this complaint?
                    </DialogContentText>
                    <Box className="deleteComplaintDialog_warning">
                        <Typography>
                            This action cannot be undone. The complaint and its
                            associated information will be permanently deleted.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions className="deleteComplaintDialog_actions">
                    <Button
                        onClick={handleCloseDeleteDialog}
                        className="deleteComplaintDialog_cancel">
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        className="deleteComplaintDialog_delete">
                        Delete Complaint
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                maxWidth="lg"
                className="complaintImageDialog">

                <Box className="complaintImageDialog_content">
                    <Button
                        className="complaintImageDialog_close"
                        onClick={() => setSelectedImage(null)}>
                        <Close />
                    </Button>

                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Complaint preview"
                            className="complaintImageDialog_image"
                        />
                    )}

                </Box>
            </Dialog>

            <Dialog
                open={openFeedbackDialog}
                onClose={() => setOpenFeedbackDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {feedbackSubmitted ? "Your Feedback" : "Give Feedback"}
                </DialogTitle>

                <DialogContent>

                    <Typography sx={{ mb: 1 }}>
                        How would you rate your experience?
                    </Typography>

                    <Rating
                        value={
                            feedbackSubmitted
                                ? feedback?.rating || 0
                                : feedbackRating
                        }
                        onChange={(_, value) => {
                            if (!feedbackSubmitted) {
                                setFeedbackRating(value);
                            }
                        }}
                        readOnly={feedbackSubmitted}
                        size="large"
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Comment"
                        value={
                            feedbackSubmitted
                                ? feedback?.comment || ""
                                : feedbackComment
                        }
                        onChange={(event) => {
                            if (!feedbackSubmitted) {
                                setFeedbackComment(event.target.value);
                            }
                        }}
                        slotProps={{
                            input: {
                                readOnly: feedbackSubmitted
                            },
                        }}
                        sx={{ mt: 3 }}
                    />

                    {feedbackSubmitted && feedback?.createdAt && (
                        <Typography
                            variant="body2"
                            sx={{ mt: 2 }}
                        >
                            Submitted on:{" "}
                            {new Date(
                                feedback.createdAt
                            ).toLocaleString()}
                        </Typography>
                    )}

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenFeedbackDialog(false)
                        }
                    >
                        Close
                    </Button>

                    {!feedbackSubmitted && (
                        <Button
                            variant="contained"
                            disabled={!feedbackRating}
                            onClick={handleSubmitFeedback}
                        >
                            Submit Feedback
                        </Button>
                    )}

                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ComplaintDetails;
