import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyComplaints } from "../../services/complaintService";

type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "in_progress" | "resolved" | "rejected";
    assignedOfficer?: string;
};

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(complaint => complaint.status === "pending").length;
    const inProgressComplaints = complaints.filter(complaint => complaint.status === "in_progress").length;
    const resolvedComplaints = complaints.filter(complaint => complaint.status === "resolved").length;

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getMyComplaints();
                setComplaints(response.complaints);
            } catch (error) {
                console.error("Failed to fetch complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    return (
        <>
            {loading ? (<Typography>Loading...</Typography>) : (<Box>
                <Typography variant="h4" gutterBottom>
                    Citizen Dashboard
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                    Welcome, Citizen!
                </Typography>

                <Button
                    onClick={() => navigate("/citizen/complaints/create")}
                    variant="contained" sx={{ mb: 3 }}>
                    Create Complaint
                </Button>

                <Button
                    onClick={() => navigate("/citizen/complaints")}
                    variant="contained" sx={{ ml: 3, mb: 3 }}>
                    My Complaint
                </Button>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)"
                        },
                        gap: 2
                    }}
                >
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Total Complaints
                        </Typography>
                        <Typography variant="h4">
                            {totalComplaints}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Pending
                        </Typography>
                        <Typography variant="h4">
                            {pendingComplaints}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
                            In Progress
                        </Typography>
                        <Typography variant="h4">
                            {inProgressComplaints}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Resolved
                        </Typography>
                        <Typography variant="h4">
                            {resolvedComplaints}
                        </Typography>
                    </Paper>
                </Box>
            </Box>)}
        </>
    )
};

export default CitizenDashboard;