import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Typography,
} from "@mui/material";
import {
    ArrowForward,
    AssignmentOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getWorkerComplaints } from "../../services/complaintService";
import { useNavigate } from "react-router-dom";
import type { Complaint } from "../../types/user";
import "./WorkerComplaints.scss";

const WorkerComplaints = () => {
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


    const getStatusLabel = (status: Complaint["status"]) => {
        switch (status) {
            case "in_progress":
                return "In Progress";

            case "assigned":
                return "Assigned";

            case "resolved":
                return "Completed";

            case "rejected":
                return "Rejected";

            default:
                return "Pending";
        }
    };


    if (loading) {
        return (
            <Box className="workerComplaints_loading">
                <Typography>
                    Loading complaints...
                </Typography>
            </Box>
        );
    }


    return (
        <Box className="workerComplaints">

            {/* Page Header */}
            <Box className="workerComplaints_header">

                <Box className="workerComplaints_headingWrapper">

                    <Box className="workerComplaints_headingIcon">
                        <AssignmentOutlined />
                    </Box>

                    <Box>
                        <Typography className="workerComplaints_heading">
                            Assigned Complaints
                        </Typography>

                        <Typography className="workerComplaints_subtitle">
                            View and manage complaints assigned to you.
                        </Typography>
                    </Box>

                </Box>

                <Typography className="workerComplaints_total">
                    {complaints.length} Total
                </Typography>

            </Box>


            {/* Complaints Table */}
            <Paper
                elevation={0}
                className="workerComplaints_tableCard"
            >

                <Box className="workerComplaints_tableHeader">

                    <Box>
                        <Typography className="workerComplaints_tableTitle">
                            Assigned Complaints
                        </Typography>

                        <Typography className="workerComplaints_tableSubtitle">
                            Complaints currently assigned to your workload.
                        </Typography>
                    </Box>

                    <Typography className="workerComplaints_count">
                        {complaints.length} Complaints
                    </Typography>

                </Box>


                <TableContainer className="workerComplaints_tableContainer">

                    <Table className="workerComplaints_table">

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

                                        <Box className="workerComplaints_empty">

                                            <Box className="workerComplaints_emptyIcon">
                                                <AssignmentOutlined />
                                            </Box>

                                            <Typography className="workerComplaints_emptyTitle">
                                                No complaints assigned
                                            </Typography>

                                            <Typography className="workerComplaints_emptyText">
                                                There are currently no complaints
                                                assigned to you.
                                            </Typography>

                                        </Box>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                complaints.map((complaint) => (

                                    <TableRow
                                        key={complaint._id}
                                        className="complaintRow"
                                    >

                                        {/* Title */}
                                        <TableCell>

                                            <Typography className="complaintTitle">
                                                {complaint.title}
                                            </Typography>

                                        </TableCell>


                                        {/* Category */}
                                        <TableCell>

                                            <Typography className="complaintCategory">
                                                {complaint.category}
                                            </Typography>

                                        </TableCell>


                                        {/* Status */}
                                        <TableCell>

                                            <Chip
                                                label={getStatusLabel(
                                                    complaint.status
                                                )}
                                                className={`complaintStatus complaintStatus_${complaint.status}`}
                                            />

                                        </TableCell>


                                        {/* Action */}
                                        <TableCell align="right">

                                            <Button
                                                className="workerComplaints_viewButton"
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

export default WorkerComplaints;

