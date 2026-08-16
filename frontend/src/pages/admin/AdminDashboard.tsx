import { Box, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { getAllComplaints } from "../../services/complaintService";
type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "in_progress" | "resolved" | "rejected";
    assignedOfficer?: string;
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(complaint => complaint.status === "pending").length;
    const inProgressComplaints = complaints.filter(complaint => complaint.status === "in_progress").length;
    const resolvedComplaints = complaints.filter(complaint => complaint.status === "resolved").length;


    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getAllComplaints();
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
            {loading ? (<Typography>Loading... </Typography>) : (<Box>
                <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}> Manage the Smart City Complaint Management System.</Typography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)"
                    }, gap: 2
                }}>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">  Total Users </Typography>
                        <Typography variant="h4"> 0 </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Total Complaints </Typography>
                        <Typography variant="h4"> {totalComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Pending Complaints </Typography>
                        <Typography variant="h4"> {pendingComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> In Progress Complaints </Typography>
                        <Typography variant="h4"> {inProgressComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Resolved Complaints </Typography>
                        <Typography variant="h4"> {resolvedComplaints} </Typography>
                    </Paper>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, 1fr)"
                        },
                        gap: 2,
                        mt: 3
                    }}
                >
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom> User Management </Typography>
                        <Typography>Manage citizens, officers and workers. </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Department Management</Typography>
                        <Typography>Manage departments and assignments. </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Complaint Analytics</Typography>
                        <Typography>Monitor complaint trends and performance. </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Reports</Typography>
                        <Typography>View and generate system reports.</Typography>
                    </Paper>

                </Box>
            </Box>)}
        </>
    );
}

export default AdminDashboard;