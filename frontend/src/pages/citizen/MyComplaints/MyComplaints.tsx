import { Box, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, TableContainer, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { getMyComplaints } from "../../../services/complaintService";
import { useNavigate } from "react-router-dom";
import type { Complaint } from "../../../types/user";
import "./MyComplaints.scss";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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

    return (
        <div>
            <Box className="myComplaints">
                <Typography className="myComplaints_heading">My Complaints</Typography>
                <Paper className="myComplaints_Table">
                    <TableContainer component={Paper} className="myComplaints_TableContainer">
                        <Table className="myComplaints_DataTable">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {complaints.map((complaint) => (
                                    <TableRow
                                        key={complaint._id}
                                        onClick={() => navigate(`/citizen/complaints/${complaint._id}`)}
                                    >
                                        <TableCell>{complaint.title}</TableCell>
                                        <TableCell>{complaint.category}</TableCell>
                                        <TableCell>{complaint.description}</TableCell>
                                        <TableCell><Chip label={complaint.status} /></TableCell>
                                        <TableCell>
                                            {new Date(
                                                complaint.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                aria-label="View complaint details"
                                            >
                                                <ChevronRightIcon />
                                            </IconButton>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ TableContainer>
                </Paper>
            </Box>
        </div>
    );
}

export default MyComplaints;
