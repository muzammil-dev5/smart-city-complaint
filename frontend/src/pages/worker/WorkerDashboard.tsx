import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import type { Complaint } from '../../types/user';
import { getWorkerComplaints } from "../../services/complaintService";
import { useNavigate } from 'react-router-dom';
import "./WorkerDashboard.scss";

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

    const [analytics, setAnalytics] = useState({
        total: 0,
        pending: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        categories: {
            roadDamage: 0,
            streetLight: 0,
            garbageCollection: 0,
        },
    });

    return (
        <>
            {loading === true ? (<Typography>Loading...</Typography>) : (
                <Box className="WorkerDashboard">
                    <div className='WorkerDashboard-header'>Worker Dashboard</div>
                    <div className='WorkerDashboard-title'>View and manage your assigned work.</div>

                    <Box className="Analytics-dashboard-card" >
                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Assigned Task </Typography>
                            <div className='Analytics-count'>{analytics.assigned}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Pending </Typography>
                            <div className='Analytics-count'>{analytics.pending}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>In Progress  </Typography>
                            <div className='Analytics-count'>{analytics.inProgress}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Completed </Typography>
                            <div className='Analytics-count'>{analytics.resolved}</div>
                        </div>
                    </Box>
                </Box>)}

            {complaints.length === 0 ? (
                <div className='WorkerDataTable'>
                    <div className='WorkerDataTable'>
                        No complaints assigned to you.
                    </div>
                </div>) : (
                <Box>
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
