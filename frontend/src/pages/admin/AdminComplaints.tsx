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
import { getAllComplaints, assignComplaint, assignWorker } from "../../services/complaintService"
import { getOfficers, getWorkers } from "../../services/userService";
import type { Complaint, Worker, Officer } from "../../types/user";

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [openWorkerDialog, setOpenWorkerDialog] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState("");

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

    const handleAssignWorker = async () => {
        if (!selectedComplaint || !selectedWorker) {
            return;
        }

        try {
            await assignWorker(
                selectedComplaint._id,
                selectedWorker
            );

            setOpenWorkerDialog(false);

            const response = await getAllComplaints();
            setComplaints(response.complaints);

            setSelectedComplaint(null);
            setSelectedWorker("");

        } catch (error) {
            console.error(
                "Failed to assign worker:",
                error
            );
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    complaintsResponse,
                    officersResponse,
                    workersResponse
                ] = await Promise.all([
                    getAllComplaints(),
                    getOfficers(),
                    getWorkers()
                ]);

                console.log("Complaints:", complaintsResponse);
                console.log("Officers:", officersResponse);

                setComplaints(complaintsResponse.complaints);
                setOfficers(officersResponse.officers);
                setWorkers(workersResponse.workers);

            } catch (error) {
                console.error("Failed to fetch admin data:", error);
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

                            <Typography>
                                Worker:{" "}
                                {complaint.worker?.name || "Not Assigned"}
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

                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setSelectedWorker(
                                        complaint.worker?._id || ""
                                    );
                                    setOpenWorkerDialog(true);
                                }}
                            >
                                {complaint.worker
                                    ? "Reassign Worker"
                                    : "Assign Worker"}
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

                            <Dialog
                                open={openWorkerDialog}
                                onClose={() => setOpenWorkerDialog(false)}
                                fullWidth
                                maxWidth="sm">

                                <DialogTitle>
                                    Assign Worker
                                </DialogTitle>

                                <DialogContent>
                                    <Typography sx={{ mb: 2 }}>
                                        Complaint: {selectedComplaint?.title}
                                    </Typography>

                                    <FormControl fullWidth>
                                        <InputLabel>Worker</InputLabel>

                                        <Select
                                            value={selectedWorker}
                                            label="Officer"
                                            onChange={(e) => {
                                                setSelectedWorker(e.target.value);
                                            }}
                                        >
                                            {workers.map((worker) => (
                                                <MenuItem
                                                    key={worker._id}
                                                    value={worker._id}
                                                >
                                                    {worker.name} ({worker.email})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </DialogContent>

                                <DialogActions>
                                    <Button
                                        onClick={() => setOpenWorkerDialog(false)}>
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        disabled={!selectedWorker}
                                        onClick={handleAssignWorker}>
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