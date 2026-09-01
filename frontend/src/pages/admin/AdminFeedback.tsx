import {
    Box,
    Chip,
    CircularProgress,
    Paper,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllFeedback } from "../../services/feedbackService";
import "./AdminFeedback.scss";

interface Feedback {
    _id: string;
    rating: number;
    comment?: string;
    createdAt: string;

    citizen: {
        _id: string;
        name: string;
        email: string;
    };

    complaint: {
        _id: string;
        title: string;
        status: string;
    };
}

const AdminFeedback = () => {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await getAllFeedback();

                setFeedback(response.feedback);
            } catch (error) {
                console.error(
                    "Failed to fetch feedback:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) {
        return (
            <Box className="adminFeedback-loading">
                <CircularProgress />

                <Typography>
                    Loading feedback...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="adminFeedback">

            {/* Header */}

            <Box className="adminFeedback-header">
                <Box>
                    <Typography className="adminFeedback-heading">
                        Citizen Feedback
                    </Typography>

                    <Typography className="adminFeedback-subtitle">
                        View feedback and ratings submitted by citizens
                    </Typography>
                </Box>

                <Box className="adminFeedback-total">
                    <Typography className="adminFeedback-totalLabel">
                        Total Feedback
                    </Typography>

                    <Typography className="adminFeedback-totalCount">
                        {feedback.length}
                    </Typography>
                </Box>
            </Box>


            {/* Feedback Table */}

            <Paper
                elevation={0}
                className="adminFeedback-card"
            >
                <Box className="adminFeedback-cardHeader">
                    <Box>
                        <Typography className="adminFeedback-cardTitle">
                            Submitted Feedback
                        </Typography>

                        <Typography className="adminFeedback-cardSubtitle">
                            Review citizen satisfaction and comments
                        </Typography>
                    </Box>
                </Box>


                <TableContainer>
                    <Table className="adminFeedback-table">

                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    Citizen
                                </TableCell>

                                <TableCell>
                                    Complaint
                                </TableCell>

                                <TableCell>
                                    Rating
                                </TableCell>

                                <TableCell>
                                    Comment
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Submitted
                                </TableCell>

                            </TableRow>
                        </TableHead>


                        <TableBody>

                            {feedback.length === 0 ? (

                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                    >
                                        <Typography className="adminFeedback-empty">
                                            No feedback submitted yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : (

                                feedback.map((item) => (

                                    <TableRow
                                        key={item._id}
                                        className="feedbackRow"
                                    >

                                        {/* Citizen */}

                                        <TableCell>
                                            <Box>
                                                <Typography className="feedback-citizenName">
                                                    {item.citizen?.name ||
                                                        "Unknown Citizen"}
                                                </Typography>

                                                <Typography className="feedback-citizenEmail">
                                                    {item.citizen?.email || "-"}
                                                </Typography>
                                            </Box>
                                        </TableCell>


                                        {/* Complaint */}

                                        <TableCell>
                                            <Typography className="feedback-complaintTitle">
                                                {item.complaint?.title ||
                                                    "Unknown Complaint"}
                                            </Typography>
                                        </TableCell>


                                        {/* Rating */}

                                        <TableCell>
                                            <Box className="feedback-rating">

                                                <Rating
                                                    value={item.rating}
                                                    readOnly
                                                    size="small"
                                                />

                                                <Typography>
                                                    {item.rating}/5
                                                </Typography>

                                            </Box>
                                        </TableCell>


                                        {/* Comment */}

                                        <TableCell>
                                            <Typography className="feedback-comment">
                                                {item.comment?.trim()
                                                    ? item.comment
                                                    : "No comment"}
                                            </Typography>
                                        </TableCell>


                                        {/* Complaint Status */}

                                        <TableCell>
                                            <Chip
                                                label={
                                                    item.complaint?.status ===
                                                    "in_progress"
                                                        ? "In Progress"
                                                        : item.complaint?.status
                                                            ? item.complaint.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            item.complaint.status.slice(1)
                                                            : "Unknown"
                                                }
                                                className={`feedback-status feedback-status-${item.complaint?.status}`}
                                            />
                                        </TableCell>


                                        {/* Date */}

                                        <TableCell>
                                            <Typography className="feedback-date">
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleDateString()}
                                            </Typography>
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

export default AdminFeedback;