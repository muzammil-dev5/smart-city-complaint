import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import type { Complaint } from '../../types/user';
import { getWorkerComplaints } from "../../services/complaintService";
import { useNavigate } from 'react-router-dom';

const WorkerDashboard = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getWorkerComplaints();

                setComplaints(response.complaints);
            } catch (error) {
                console.error(
                    "Failed to fetch worker complaints:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(complaint => complaint.status === "pending").length;

    const inProgressComplaints = complaints.filter(complaint => complaint.status === "in_progress").length;

    const completedComplaints = complaints.filter(complaint => complaint.status === "resolved").length;

    return (
        <>
            {loading === true ? (<Typography>Loading...</Typography>) : (<Box>
                <Typography variant="h4" gutterBottom>Worker Dashboard</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}> View and manage your assigned work.</Typography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)"
                    }, gap: 2
                }}>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Assigned Tasks </Typography>
                        <Typography variant="h4"> {totalComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Pending </Typography>
                        <Typography variant="h4"> {pendingComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> In Progress </Typography>
                        <Typography variant="h4"> {inProgressComplaints} </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Completed </Typography>
                        <Typography variant="h4"> {completedComplaints} </Typography>
                    </Paper>
                </Box>
            </Box>)}

            {complaints.length === 0 ? (
                <Paper sx={{ p: 3 }}>
                    <Typography>
                        No complaints assigned to you.
                    </Typography>
                </Paper>) : (
                <Box>
                    <Typography></Typography>
                    <TableContainer component={Paper}>
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
                                        <TableCell>  <Chip
                                            label={
                                                complaint.status === "in_progress"
                                                    ? "In Progress"
                                                    : complaint.status === "resolved"
                                                        ? "Completed"
                                                        : complaint.status
                                            }
                                            size="small"
                                        /></TableCell>
                                        <TableCell><Button variant='outlined' size='small' onClick={() => navigate(`/worker/complaint/${complaint._id}`)}>View</Button></TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
}

export default WorkerDashboard;
