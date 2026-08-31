import {
    ArrowForward,
    AssignmentOutlined,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Complaint } from "../../types/user";
import { getWorkerComplaints } from "../../services/complaintService";
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

    const analytics = {
        assigned: complaints.filter(
            (complaint) => complaint.status === "assigned"
        ).length,

        pending: complaints.filter(
            (complaint) => complaint.status === "pending"
        ).length,

        inProgress: complaints.filter(
            (complaint) => complaint.status === "in_progress"
        ).length,

        resolved: complaints.filter(
            (complaint) => complaint.status === "resolved"
        ).length,
    };

    const getStatusLabel = (status: Complaint["status"]) => {
        switch (status) {
            case "in_progress":
                return "In Progress";

            case "assigned":
                return "Assigned";

            case "resolved":
                return "Resolved";

            case "rejected":
                return "Rejected";

            default:
                return "Pending";
        }
    };

    if (loading) {
        return (
            <Box className="workerDashboard_loading">
                <Typography>
                    Loading dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="workerDashboard">

            {/* Dashboard Header */}
            <Box className="workerDashboard_header">
                <Typography className="workerDashboard_heading">
                    Worker Dashboard
                </Typography>

                <Typography className="workerDashboard_subtitle">
                    Manage and complete your assigned tasks.
                </Typography>
            </Box>


            {/* Analytics */}
            <Box className="workerDashboard_analytics">

                <Box className="analyticsCard">
                    <Box className="analyticsCard_icon">
                        <AssignmentOutlined />
                    </Box>

                    <Box>
                        <Typography className="analyticsCard_title">
                            Assigned Tasks
                        </Typography>

                        <Typography className="analyticsCard_count">
                            {analytics.assigned}
                        </Typography>
                    </Box>
                </Box>


                <Box className="analyticsCard">
                    <Box className="analyticsCard_icon">
                        <AssignmentOutlined />
                    </Box>

                    <Box>
                        <Typography className="analyticsCard_title">
                            Pending Tasks
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
                            Completed Tasks
                        </Typography>

                        <Typography className="analyticsCard_count">
                            {analytics.resolved}
                        </Typography>
                    </Box>
                </Box>

            </Box>


            {/* Assigned Complaints */}
            <Paper
                elevation={0}
                className="workerDashboard_tableCard"
            >

                <Box className="workerDashboard_tableHeader">

                    <Box>
                        <Typography className="workerDashboard_tableTitle">
                            Assigned Tasks
                        </Typography>

                        <Typography className="workerDashboard_tableSubtitle">
                            Complaints currently assigned to you.
                        </Typography>
                    </Box>

                    <Typography className="workerDashboard_total">
                        {complaints.length} Total
                    </Typography>

                </Box>


                <TableContainer>
                    <Table className="workerDashboard_table">

                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    Title
                                </TableCell>

                                <TableCell>
                                    Category
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell align="right">
                                    Action
                                </TableCell>

                            </TableRow>
                        </TableHead>


                        <TableBody>

                            {complaints.length === 0 ? (

                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                    >
                                        <Typography className="workerDashboard_empty">
                                            No tasks assigned to you.
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : (

                                complaints.map((complaint) => (

                                    <TableRow
                                        key={complaint._id}
                                        className="complaintRow"
                                    >

                                        <TableCell>
                                            <Typography className="complaintTitle">
                                                {complaint.title}
                                            </Typography>
                                        </TableCell>


                                        <TableCell>
                                            {complaint.category}
                                        </TableCell>


                                        <TableCell>
                                            <Chip
                                                label={getStatusLabel(
                                                    complaint.status
                                                )}
                                                className={`complaintStatus complaintStatus_${complaint.status}`}
                                            />
                                        </TableCell>


                                        <TableCell align="right">

                                            <Button
                                                className="workerDashboard_viewButton"
                                                endIcon={<ArrowForward />}
                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    navigate(
                                                        `/worker/complaint/${complaint._id}`
                                                    );

                                                }}
                                            >
                                                View
                                            </Button>

                                        </TableCell>

                                    </TableRow>

                                ))

                            )}

                        </TableBody>

                    </Table>
                </TableContainer>

            </Paper>

        </Box>
    );
};

export default WorkerDashboard;