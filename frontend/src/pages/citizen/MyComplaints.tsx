import {
    Box,
    Chip,
    IconButton,
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
import { getMyComplaints } from "../../services/complaintService";
import { useNavigate } from "react-router-dom";
import type { Complaint } from "../../types/user";
import "./MyComplaints.scss";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const MyComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getMyComplaints();
                setComplaints(response.complaints);
            } catch (error) {
                console.error("Failed to fetch complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    const getStatusClass = (status: string) => {
        return `complaint-status complaint-status-${status
            .toLowerCase()
            .replace(/\s+/g, "_")}`;
    };

    const formatStatus = (status: string) => {
        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleViewComplaint = (id: string) => {
        navigate(`/citizen/complaints/${id}`);
    };

    return (
        <Box className="myComplaints">
            {/* ================= HEADER ================= */}
            <Box className="myComplaints_header">
                <Box className="myComplaints_headerContent">
                    <Box className="myComplaints_headerIcon">
                        <AssignmentOutlinedIcon />
                    </Box>

                    <Box>
                        <Typography className="myComplaints_heading">
                            My Complaints
                        </Typography>

                        <Typography className="myComplaints_subtitle">
                            Track and manage all your submitted complaints
                        </Typography>
                    </Box>
                </Box>

                <Box className="myComplaints_count">
                    <Typography className="myComplaints_countValue">
                        {complaints.length}
                    </Typography>

                    <Typography className="myComplaints_countLabel">
                        Total
                    </Typography>
                </Box>
            </Box>

            {/* ================= DESKTOP / TABLET TABLE ================= */}
            <Paper className="myComplaints_tableCard">
                <TableContainer className="myComplaints_TableContainer">
                    <Table
                        stickyHeader
                        className="myComplaints_DataTable"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {complaints.map((complaint) => (
                                <TableRow
                                    key={complaint._id}
                                    className="myComplaints_tableRow"
                                    onClick={() =>
                                        handleViewComplaint(complaint._id)
                                    }
                                >
                                    <TableCell>
                                        <Typography className="complaint_title">
                                            {complaint.title}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography className="complaint_category">
                                            {complaint.category}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography className="complaint_description">
                                            {complaint.description}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        {complaint.images &&
                                            complaint.images.length > 0 ? (
                                            <Box className="complaintTable_imageWrapper">
                                                <img
                                                    src={complaint.images[0]}
                                                    alt="Complaint"
                                                    className="complaintTable_image"
                                                />

                                                {complaint.images.length >
                                                    1 && (
                                                        <Typography className="complaintTable_imageCount">
                                                            +
                                                            {complaint.images
                                                                .length - 1}
                                                        </Typography>
                                                    )}
                                            </Box>
                                        ) : (
                                            <Box className="complaintTable_noImageWrapper">
                                                <ImageOutlinedIcon />

                                                <Typography className="complaintTable_noImage">
                                                    No image
                                                </Typography>
                                            </Box>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={formatStatus(
                                                complaint.status
                                            )}
                                            className={getStatusClass(
                                                complaint.status
                                            )}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Box className="complaint_date">
                                            <Typography>
                                                {formatDate(
                                                    complaint.createdAt
                                                )}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="center">
                                        <IconButton
                                            className="complaint_action"
                                            size="small"
                                            aria-label="View complaint details"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleViewComplaint(
                                                    complaint._id
                                                );
                                            }}
                                        >
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {complaints.length === 0 && (
                        <Box className="myComplaints_empty">
                            <Box className="myComplaints_emptyIcon">
                                <AssignmentOutlinedIcon />
                            </Box>

                            <Typography className="myComplaints_emptyTitle">
                                No complaints found
                            </Typography>

                            <Typography className="myComplaints_emptyText">
                                You haven't submitted any complaints yet.
                            </Typography>
                        </Box>
                    )}
                </TableContainer>
            </Paper>

            {/* ================= MOBILE CARDS ================= */}
            <Box className="myComplaints_mobileList">
                {complaints.length > 0 ? (
                    complaints.map((complaint) => (
                        <Paper
                            key={complaint._id}
                            className="myComplaints_mobileCard"
                            onClick={() =>
                                handleViewComplaint(complaint._id)
                            }
                        >
                            {/* Card Top */}
                            <Box className="mobileComplaint_top">
                                <Box className="mobileComplaint_titleArea">
                                    <Typography className="mobileComplaint_title">
                                        {complaint.title}
                                    </Typography>

                                    <Typography className="mobileComplaint_id">
                                        #{complaint._id.slice(-6).toUpperCase()}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={formatStatus(complaint.status)}
                                    className={getStatusClass(
                                        complaint.status
                                    )}
                                />
                            </Box>

                            {/* Description */}
                            <Typography className="mobileComplaint_description">
                                {complaint.description}
                            </Typography>

                            {/* Image */}
                            {complaint.images &&
                                complaint.images.length > 0 ? (
                                <Box className="mobileComplaint_imageWrapper">
                                    <img
                                        src={complaint.images[0]}
                                        alt="Complaint"
                                        className="mobileComplaint_image"
                                    />

                                    {complaint.images.length > 1 && (
                                        <Typography className="mobileComplaint_imageCount">
                                            +{complaint.images.length - 1}
                                        </Typography>
                                    )}
                                </Box>
                            ) : null}

                            {/* Meta */}
                            <Box className="mobileComplaint_meta">
                                <Box className="mobileComplaint_metaItem">
                                    <CategoryOutlinedIcon />

                                    <Typography>
                                        {complaint.category}
                                    </Typography>
                                </Box>

                                <Box className="mobileComplaint_metaItem">
                                    <CalendarTodayOutlinedIcon />

                                    <Typography>
                                        {formatDate(complaint.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Bottom Action */}
                            <Box className="mobileComplaint_action">
                                <Typography>
                                    View complaint details
                                </Typography>

                                <ChevronRightIcon />
                            </Box>
                        </Paper>
                    ))
                ) : (
                    <Box className="myComplaints_mobileEmpty">
                        <AssignmentOutlinedIcon />

                        <Typography>
                            No complaints found
                        </Typography>

                        <span>
                            You haven't submitted any complaints yet.
                        </span>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MyComplaints;
