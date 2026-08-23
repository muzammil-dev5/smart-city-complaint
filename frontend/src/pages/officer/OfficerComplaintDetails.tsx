import {
    Box,
    Paper,
    Typography,
    Chip,
    Button
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssignedComplaintById, updateComplaintStatus } from "../../services/complaintService";


type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "assigned" | "in_progress" | "resolved" | "rejected";
    createdAt: string;
    citizen?: {
        name: string;
        email: string;
    };
};

const OfficerComplaintDetails = () => {
    const { id } = useParams();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;

            try {
                const response = await getAssignedComplaintById(id);

                setComplaint(response.complaint);
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
            <Paper
                elevation={3}
                sx={{ p: 3 }}
            >
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

                {complaint.status !== "resolved" &&
                    complaint.status !== "rejected" && (
                        <Button
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={updating}
                            onClick={async () => {
                                const nextStatus =
                                    complaint.status === "assigned"
                                        ? "in_progress"
                                        : "resolved";

                                try {
                                    setUpdating(true);

                                    const response =
                                        await updateComplaintStatus(
                                            complaint._id,
                                            nextStatus
                                        );

                                    setComplaint(response.complaint);

                                } catch (error) {
                                    console.error(
                                        "Failed to update complaint status:",
                                        error
                                    );
                                } finally {
                                    setUpdating(false);
                                }
                            }}
                        >
                            {updating
                                ? "Updating..."
                                : complaint.status === "assigned"
                                    ? "Start Complaint"
                                    : "Mark as Resolved"}
                        </Button>
                    )}

                <Typography sx={{ mt: 2 }}>
                    <strong>Date:</strong>{" "}
                    {new Date(
                        complaint.createdAt
                    ).toLocaleString()}
                </Typography>

                {complaint.citizen && (
                    <>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Citizen:</strong>{" "}
                            {complaint.citizen.name}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Email:</strong>{" "}
                            {complaint.citizen.email}
                        </Typography>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default OfficerComplaintDetails;
