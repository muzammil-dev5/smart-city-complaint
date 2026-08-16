import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    DialogActions,
    MenuItem
} from "@mui/material";


import { useEffect, useState } from "react";
import { getAllComplaints, assignComplaint } from "../../services/complaintService"
import { getOfficers } from "../../services/userService";

type Complaint = {
    _id: string;
    title: string;
    category: string;
    status: "pending" | "in_progress" | "resolved" | "rejected";
    citizen?: {
        _id: string;
        name: string;
        email: string;
    };
    assignedOfficer?: {
        _id: string;
        name: string;
        email: string;
    } | null;
};

type Officer = {
    _id: string;
    name: string;
    email: string;
};

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [selectedOfficer, setSelectedOfficer] = useState("");

    const handleAssignOfficer = async () => {
        if (!selectedComplaint || !selectedOfficer) {
            return;
        }

        try {
            await assignComplaint(
                selectedComplaint._id,
                selectedOfficer
            );

            setOpenDialog(false);

            const response = await getAllComplaints();

            setComplaints(response.complaints);

            setSelectedComplaint(null);
            setSelectedOfficer("");

        } catch (error) {
            console.error(
                "Failed to assign officer:",
                error
            );
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [complaintsResponse, officersResponse] =
                    await Promise.all([
                        getAllComplaints(),
                        getOfficers()
                    ]);

                console.log("Complaints:", complaintsResponse);
                console.log("Officers:", officersResponse);

                setComplaints(complaintsResponse.complaints);
                setOfficers(officersResponse.officers);

            } catch (error) {
                console.error(
                    "Failed to fetch admin data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Complaints
            </Typography>

            <Paper sx={{ p: 3 }}>
                {complaints.length === 0 ? (
                    <Typography>
                        No complaints found.
                    </Typography>
                ) : (
                    complaints.map((complaint) => (
                        <Box
                            key={complaint._id}
                            sx={{
                                py: 2,
                                borderBottom: "1px solid #ddd"
                            }}
                        >
                            <Typography variant="h6">
                                {complaint.title}
                            </Typography>

                            <Typography>
                                Category: {complaint.category}
                            </Typography>

                            <Typography>
                                Status: {complaint.status}
                            </Typography>

                            <Typography>
                                Citizen:{" "}
                                {complaint.citizen?.name || "Unknown"}
                            </Typography>

                            <Typography>
                                Officer:{" "}
                                {complaint.assignedOfficer?.name ||
                                    "Not Assigned"}
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setSelectedOfficer(
                                        complaint.assignedOfficer?._id || ""
                                    );
                                    setOpenDialog(true);
                                }}
                            >
                                {complaint.assignedOfficer
                                    ? "Reassign Officer"
                                    : "Assign Officer"}
                            </Button>

                            <Dialog
                                open={openDialog}
                                onClose={() => setOpenDialog(false)}
                                fullWidth
                                maxWidth="sm"
                            >
                                <DialogTitle>
                                    Assign Officer
                                </DialogTitle>

                                <DialogContent>
                                    <Typography sx={{ mb: 2 }}>
                                        Complaint: {selectedComplaint?.title}
                                    </Typography>

                                    <FormControl fullWidth>
                                        <InputLabel>Officer</InputLabel>

                                        <Select
                                            value={selectedOfficer}
                                            label="Officer"
                                            onChange={(e) => {
                                                setSelectedOfficer(e.target.value);
                                            }}
                                        >
                                            {officers.map((officer) => (
                                                <MenuItem
                                                    key={officer._id}
                                                    value={officer._id}
                                                >
                                                    {officer.name} ({officer.email})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </DialogContent>

                                <DialogActions>
                                    <Button
                                        onClick={() => setOpenDialog(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        disabled={!selectedOfficer}
                                        onClick={handleAssignOfficer}
                                    >
                                        Assign
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>

                    ))
                )}
            </Paper>
        </Box>
    );
};

export default AdminComplaints;