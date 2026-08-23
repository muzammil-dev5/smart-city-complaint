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
    DialogActions
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkerComplaintById, updateWorkerComplaintStatus } from "../../services/complaintService";

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

const WorkerComplaintDetails = () => {
    const { id } = useParams();
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
            const response =
                await updateWorkerComplaintStatus(id, status);

            setComplaint(response.complaint);
            handleCloseStatusDialog();

        } catch (error) {
            console.error(
                "Worker status update error:",
                error
            );
        }
    };

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;

            try {
                const response =
                    await getWorkerComplaintById(id);

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
        return <Typography>Loading complaint...</Typography>;
    }

    if (!complaint) {
        return (
            <Typography>
                Complaint not found.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography
                variant="h4"
                gutterBottom
            >
                Complaint Details
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                >
                    {complaint.title}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    <strong>Description:</strong>{" "}
                    {complaint.description}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    <strong>Category:</strong>{" "}
                    {complaint.category}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                        label={
                            complaint.status === "in_progress"
                                ? "In Progress"
                                : complaint.status
                        }
                    />
                </Typography>


                {complaint.status === "in_progress" && (
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        color="success"
                        onClick={() =>
                            handleOpenStatusDialog("resolved")
                        }
                    >
                        Mark Completed
                    </Button>
                )}

                <Dialog
                    open={openStatusDialog}
                    onClose={handleCloseStatusDialog}
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
                        <Button onClick={handleCloseStatusDialog}>
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color={
                                selectedStatus === "resolved"
                                    ? "success"
                                    : "primary"
                            }
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

                <Typography sx={{ mt: 2 }}>
                    <strong>Location:</strong>{" "}
                    {complaint.location?.address ||
                        "N/A"}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    <strong>Date:</strong>{" "}
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

                {complaint.statusHistory.map(
                    (history) => (
                        <Box
                            key={`${history.status}-${history.changedAt}`}
                            sx={{ mb: 2 }}
                        >
                            <Typography>
                                {history.status ===
                                    "in_progress"
                                    ? "In Progress"
                                    : history.status
                                        .charAt(0)
                                        .toUpperCase() +
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
                        </Box>
                    )
                )}
            </Paper>
        </Box>
    );
};

export default WorkerComplaintDetails;