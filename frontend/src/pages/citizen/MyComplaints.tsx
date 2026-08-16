import { Box, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { getMyComplaints } from "../../services/complaintService";
import { useNavigate } from "react-router-dom";

type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: string;
};

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
            <Box>
                <Typography></Typography>
                <Paper>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    {/* <TableCell>Action</TableCell> */}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {complaints.map((complaint) => (
                                    <TableRow
                                        key={complaint._id}
                                        onClick={() => navigate(`/citizen/complaints/${complaint._id}`)}
                                    >
                                        <TableCell>{complaint.title}</TableCell>
                                        <TableCell>{complaint.description}</TableCell>
                                        <TableCell>{complaint.category}</TableCell>
                                        <TableCell><Chip label={complaint.status} /></TableCell>
                                        <TableCell>
                                            {new Date(
                                                complaint.createdAt
                                            ).toLocaleDateString()}
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
