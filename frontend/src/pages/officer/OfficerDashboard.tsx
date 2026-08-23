import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getAssignedComplaints } from '../../services/complaintService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Complaint } from '../../types/user';
import "./OfficerDashboard.scss"

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
            {loading ? (<Typography>Loading...</Typography>) : (
                <Box className="OfficerDashboard">
                    <div className='OfficerDashboard-header'>Officer Dashboard</div>
                    <div className='OfficerDashboard-title'>Manage and monitor assigned complaints.</div>

                    <Box className="Analytics-dashboard-card" >
                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Assigned Complaints </Typography>
                            <div className='Analytics-count'>{analytics.assigned}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Pending Complaints </Typography>
                            <div className='Analytics-count'>{analytics.pending}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>In Progress Complaints </Typography>
                            <div className='Analytics-count'>{analytics.inProgress}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Resolved Complaints </Typography>
                            <div className='Analytics-count'>{analytics.resolved}</div>
                        </div>

                    </Box >
                </Box >)}

            <TableContainer className='officerDataTable'>
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
                        {
                            complaints.length === 0 ? (
                                (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Typography sx={{ py: 3 }}>
                                                No complaints assigned to you.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                complaints.map((complaint) => (
                                    <TableRow key={complaint._id}>
                                        <TableCell>{complaint.title}</TableCell>
                                        <TableCell>{complaint.category}</TableCell>
                                        <TableCell>{complaint.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                className='officerDataTable-Btn'
                                                onClick={() => navigate(`/officer/complaints/${complaint._id}`)}
                                                variant="outlined">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
}

export default OfficerDashboard;
