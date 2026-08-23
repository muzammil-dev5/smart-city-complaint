import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyComplaints } from "../../services/complaintService";
import type { Complaint } from "../../types/user";
import "./CitizenDashboard.scss";

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState<Complaint[]>([]);

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
            {loading ? (<Typography>Loading...</Typography>) : (
                <Box className="citizenDashboard">
                    <div className='citizenDashboard-header'>Citizen Dashboard</div>
                    <div className='citizenDashboard-title'>Welcome, Citizen!</div>
                    {/* <div className="citizenDashboard-Btn">
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
                    </div> */}

                    <Box className="Analytics-dashboard-card" >
                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Total Complaints </Typography>
                            <div className='Analytics-count'>{analytics.total}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Pending </Typography>
                            <div className='Analytics-count'>{analytics.pending}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>In Progress </Typography>
                            <div className='Analytics-count'>{analytics.inProgress}</div>
                        </div>

                        <div className='Analytics-card'>
                            <Typography className='Analytics-title'>Resolved </Typography>
                            <div className='Analytics-count'>{analytics.resolved}</div>
                        </div>

                    </Box>
                </Box>
            )}
        </>
    )
};

export default CitizenDashboard;