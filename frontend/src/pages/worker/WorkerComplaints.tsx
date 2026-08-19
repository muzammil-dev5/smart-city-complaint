import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { getWorkerComplaints } from "../../services/complaintService"
import { useNavigate } from "react-router-dom";
import type { Complaint } from "../../types/user";

const WorkerComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getWorkerComplaints();
                setComplaints(response.complaints)
            }
            catch (error) {
                console.error("Failed to fetch worker complaints:", error)
            }
            finally {
                setLoading(false)
            }
        }

        fetchComplaints();
    }, [])



    if (loading) {
        return <Typography>Loading complaints...</Typography>;
    }

    return (
        <div>
            <Box>
                <Typography variant="h4" gutterBottom>
                    Assigned Complaints
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mb: 3 }}
                >
                    View complaints assigned to you.
                </Typography>
                {complaints.length === 0 ? (<Typography> No complaints assigned to you.</Typography>
                ) : (<TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title </TableCell>
                                <TableCell>Category </TableCell>
                                <TableCell>Status </TableCell>
                                <TableCell>Action </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {complaints.map((complaint) => (
                                <TableRow key={complaint._id}>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.category}</TableCell>
                                    <TableCell><Chip
                                        label={
                                            complaint.status ===
                                                "in_progress"
                                                ? "In Progress"
                                                : complaint.status
                                        }
                                        size="small"
                                    /></TableCell>
                                    <TableCell><Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate(`/worker/complaint/${complaint._id}`)}> View
                                    </ Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)}
            </Box>

        </div>
    )
}

export default WorkerComplaints