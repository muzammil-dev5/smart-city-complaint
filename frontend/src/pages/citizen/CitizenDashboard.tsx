import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getMyComplaints } from "../../services/complaintService";
import type { Complaint } from "../../types/user";
import "./CitizenDashboard.scss";
import { AssignmentOutlined } from "@mui/icons-material";

const CitizenDashboard = () => {
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
                    <Box className="citizenDashboard_header">
                        <Typography className="citizenDashboard_heading">
                            Citizen Dashboard
                        </Typography>

                        <Typography className="citizenDashboard_subtitle">
                            Welcome, Citizen!
                        </Typography>
                    </Box>

                    <Box className="citizenDashboard_analytics">
                        <Box className="analyticsCard">
                            <Box className="analyticsCard_icon">
                                <AssignmentOutlined />
                            </Box>
                            <Box>
                                <Typography className="analyticsCard_title">
                                    Total Complaints
                                </Typography>

                                <Typography className="analyticsCard_count">
                                    {analytics.total}
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="analyticsCard">
                            <Box className="analyticsCard_icon">
                                <AssignmentOutlined />
                            </Box>
                            <Box>
                                <Typography className="analyticsCard_title">
                                    Pending Complaints
                                </Typography>

                                <Typography className="analyticsCard_count">
                                    {analytics.pending}
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="analyticsCard">
                            <Box className="analyticsCard_icon">
                                <AssignmentOutlined />
                            </Box>
                            <Box>
                                <Typography className="analyticsCard_title">
                                    In Progress
                                </Typography>

                                <Typography className="analyticsCard_count">
                                    {analytics.inProgress}
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="analyticsCard">
                            <Box className="analyticsCard_icon">
                                <AssignmentOutlined />
                            </Box>
                            <Box>
                                <Typography className="analyticsCard_title">
                                    Resolved Complaints
                                </Typography>

                                <Typography className="analyticsCard_count">
                                    {analytics.resolved}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    )
};

export default CitizenDashboard;