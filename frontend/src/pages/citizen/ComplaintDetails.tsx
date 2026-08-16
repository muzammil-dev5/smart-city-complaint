import {
    Box, Chip, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from "@mui/lab";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getComplaintById, deleteComplaint, updateComplaintStatus } from "../../services/complaintService";
import { useNavigate } from "react-router-dom";

type StatusHistory = {
    status: "pending" | "in_progress" | "resolved" | "rejected";
    changedAt: string
};

type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: string;
    statusHistory: StatusHistory[];
}

const ComplaintDetails = () => {
    const [complaint, setComplaint] = useState<Complaint | null>(null);
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

    if (!complaint) {
        return (
            <Typography>
                Loading complaint...
            </Typography>
        );
    }

    return (
        <div>
            <Box>
                <Typography variant="h4" gutterBottom>
                    Complaint Details
                </Typography>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography sx={{ mt: 2 }}>
                        {complaint.title}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Description: </strong>{" "}
                        {complaint.description}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Category: </strong>{" "}
                        {complaint.category}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Status: </strong>{" "}
                        <Chip label={complaint.status} />
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Date: </strong>{" "}
                        {new Date(
                            complaint.createdAt
                        ).toLocaleDateString()}
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{ mt: 4, mb: 2 }}
                    >
                        Status History
                    </Typography>

                    <Timeline>
                        {complaint.statusHistory.map((history, index) => (
                            <TimelineItem
                                key={`${history.status}-${history.changedAt}`}
                            >
                                <TimelineSeparator>
                                    <TimelineDot />

                                    {index < complaint.statusHistory.length - 1 && (
                                        <TimelineConnector />
                                    )}
                                </TimelineSeparator>

                                <TimelineContent>
                                    <Typography variant="h6">
                                        {history.status === "in_progress"
                                            ? "In Progress"
                                            : history.status.charAt(0).toUpperCase() +
                                            history.status.slice(1)}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {new Date(
                                            history.changedAt
                                        ).toLocaleString()}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                    <Typography>
                        {role === "citizen" && (
                            <>
                                <Button sx={{ mt: 2 }}
                                    variant="contained"
                                    onClick={() => navigate(`/citizen/complaints/${complaint._id}/edit`)}>
                                    Edit Complaint
                                </Button>

                                <Button sx={{ ml: 2, mt: 2 }}
                                    variant="contained"
                                    color="error"
                                    onClick={handleOpenDeleteDialog}>
                                    Delete Complaint
                                </Button>
                            </>
                        )}

                        {role === "officer" && (
                            <>
                                {complaint.status === "pending" && (
                                    <Button
                                        sx={{ mt: 2 }}
                                        variant="contained"
                                        onClick={() =>
                                            handleStatusUpdate("in_progress")
                                        }
                                    >
                                        Start Progress
                                    </Button>
                                )}

                                {complaint.status === "in_progress" && (
                                    <Button
                                        sx={{ mt: 2 }}
                                        variant="contained"
                                        onClick={() =>
                                            handleStatusUpdate("resolved")
                                        }
                                    >
                                        Mark Resolved
                                    </Button>
                                )}
                            </>
                        )}

                        <Dialog
                            open={openDeleteDialog}
                            onClose={handleCloseDeleteDialog}>

                            <DialogTitle>Delete Complaint </DialogTitle>

                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this complaint?
                                    This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                                <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                            </DialogActions>

                        </Dialog>

                    </Typography>
                </Paper>
            </Box>
        </div>
    );
}

export default ComplaintDetails;
