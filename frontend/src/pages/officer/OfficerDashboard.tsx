import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getAssignedComplaints } from '../../services/complaintService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "in_progress" | "resolved" | "rejected";
    assignedOfficer?: string;
};

const OfficerDashboard = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getAssignedComplaints();
                setComplaints(response.complaints);
            }
            catch (error) {
                console.error("Failed to fetch assigned complaints:", error);
            }
            finally {
                setLoading(false)
            }
        }
        fetchComplaints();
    }, [])

    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(complaint => complaint.status === "pending").length;
    const inProgressComplaints = complaints.filter(complaint => complaint.status === "in_progress").length;
    const resolvedComplaints = complaints.filter(complaint => complaint.status === "resolved").length;

    return (
        <>
            {loading ? (<Typography>Loading...</Typography>) : (<Box>
                <Typography variant="h4" gutterBottom>Officer Dashboard</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>Manage and monitor assigned complaints.</Typography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)"
                    }, gap: 2
                }}>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Assigned Complaints </Typography>
                        <Typography variant="h4"> {totalComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Pending </Typography>
                        <Typography variant="h4"> {pendingComplaints}</Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> In Progress </Typography>
                        <Typography variant="h4"> {inProgressComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Resolved </Typography>
                        <Typography variant="h4"> {resolvedComplaints} </Typography>
                    </Paper>
                </Box>
            </Box >)}


            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>{complaint.category}</TableCell>
                                <TableCell>{complaint.status}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => navigate(`/officer/complaints/${complaint._id}`)}
                                        variant="outlined"

                                    >View</Button></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
}

export default OfficerDashboard;
