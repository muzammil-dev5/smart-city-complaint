import {
    Box, Paper, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, DialogActions, MenuItem, Chip, Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllComplaints, assignComplaint, assignWorker, } from "../../services/complaintService";
import { getOfficers, getWorkers } from "../../services/userService";
import { getActiveDepartments } from "../../services/departmentService";
import type { Complaint, Worker, Officer } from "../../types/user";
import "./AdminComplaints.scss";

type Department = {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
};

const formatText = (value?: string) => {
    if (!value) return "Not Available";

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openWorkerDialog, setOpenWorkerDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const handleAssignOfficer = async () => {
        if (!selectedComplaint || !selectedDepartment || !selectedOfficer) {
            return;
        }
        try {
            await assignComplaint(
                selectedComplaint._id,
                selectedDepartment,
                selectedOfficer
            );

            setOpenDialog(false);
            const responseData = await getAllComplaints();
            setComplaints(responseData.complaints);
            setSelectedComplaint(null);
            setSelectedDepartment("");
            setSelectedOfficer("");
        } catch (error) {
            console.error("Failed to assign complaint:", error);
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
            console.error("Failed to assign worker:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    complaintsResponse,
                    officersResponse,
                    workersResponse,
                    departmentsResponse,
                ] = await Promise.all([
                    getAllComplaints(),
                    getOfficers(),
                    getWorkers(),
                    getActiveDepartments(),
                ]);
                setComplaints(complaintsResponse.complaints);
                setOfficers(officersResponse.officers);
                setWorkers(workersResponse.workers);
                setDepartments(departmentsResponse.departments);
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
            <Box className="adminComplaints-loading">
                <CircularProgress />
                <Typography>Loading complaints...</Typography>
            </Box>
        );
    }

    return (
        <Box className="adminComplaints">
            <Box className="adminComplaints-header">
                <Box>
                    <Typography className="adminComplaints-title">
                        All Complaints
                    </Typography>

                    <Typography className="adminComplaints-subtitle">
                        Review complaints and manage officer and worker assignments.
                    </Typography>
                </Box>

                <Box className="adminComplaints-count">
                    <Typography className="count-number">
                        {complaints.length}
                    </Typography>

                    <Typography className="count-label">
                        Total Complaints
                    </Typography>
                </Box>
            </Box>

            {complaints.length === 0 ? (
                <Paper className="emptyComplaints">
                    <Typography>
                        No complaints found.
                    </Typography>
                </Paper>
            ) : (
                <Box className="complaints-grid">

                    {complaints.map((complaint) => (
                        <Paper
                            key={complaint._id}
                            className="complaint-card"
                            elevation={0}>

                            <Box className="complaint-card-header">
                                <Box className="complaint-card-title-wrapper">
                                    <Typography className="complaint-card-title">
                                        {complaint.title}
                                    </Typography>

                                    <Typography className="complaint-id">
                                        Complaint ID: {complaint._id.slice(-8)}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={formatText(complaint.status)}
                                    className={`status-chip status-${complaint.status}`}
                                />
                            </Box>
                            <Divider />

                            <Box className="complaint-info">
                                <Box className="info-item">
                                    <Typography className="info-label">
                                        Category
                                    </Typography>

                                    <Typography className="info-value">
                                        {formatText(complaint.category)}
                                    </Typography>
                                </Box>

                                <Box className="info-item">
                                    <Typography className="info-label">
                                        Citizen
                                    </Typography>

                                    <Typography className="info-value">
                                        {complaint.citizen?.name || "Unknown"}
                                    </Typography>
                                </Box>

                                <Box className="info-item">
                                    <Typography className="info-label">
                                        Officer
                                    </Typography>

                                    <Typography className="info-value">
                                        {complaint.assignedOfficer?.name ||
                                            "Not Assigned"}
                                    </Typography>
                                </Box>

                                <Box className="info-item">
                                    <Typography className="info-label">
                                        Worker
                                    </Typography>

                                    <Typography className="info-value">
                                        {complaint.worker?.name ||
                                            "Not Assigned"}
                                    </Typography>
                                </Box>
                            </Box>


                            {/* <Box className="complaint-preview">

                                <Box className="preview-placeholder">
                                    📍
                                </Box>

                                <Box>
                                    <Typography className="preview-title">
                                        Complaint Location
                                    </Typography>

                                    <Typography className="preview-text">
                                        Location details will appear here
                                    </Typography>
                                </Box>

                            </Box> */}

                            <Box className="complaint-actions">
                                <Button
                                    variant="outlined"
                                    className="assign-officer-btn"
                                    onClick={() => {
                                        setSelectedComplaint(complaint);
                                        setSelectedOfficer(
                                            complaint.assignedOfficer?._id || ""
                                        );
                                        setSelectedDepartment("");
                                        setOpenDialog(true);
                                    }}>
                                    {complaint.assignedOfficer
                                        ? "Reassign Officer"
                                        : "Assign Officer"}
                                </Button>

                                <Button
                                    variant="contained"
                                    className="assign-worker-btn"
                                    onClick={() => {
                                        setSelectedComplaint(complaint);

                                        setSelectedWorker(
                                            complaint.worker?._id || ""
                                        );
                                        setOpenWorkerDialog(true);
                                    }}>
                                    {complaint.worker
                                        ? "Reassign Worker"
                                        : "Assign Worker"}
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm"
                className="assignment-dialog">
                <DialogTitle>
                    Assign Officer
                </DialogTitle>

                <DialogContent>
                    <Typography className="dialog-complaint">
                        Complaint:{" "}
                        <strong>
                            {selectedComplaint?.title}
                        </strong>
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Department</InputLabel>

                        <Select
                            value={selectedDepartment}
                            label="Department"
                            onChange={(e) =>
                                setSelectedDepartment(e.target.value)
                            }>
                            {departments.map((department) => (
                                <MenuItem
                                    key={department._id}
                                    value={department._id}
                                >
                                    {department.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Officer</InputLabel>
                        <Select
                            value={selectedOfficer}
                            label="Officer"
                            onChange={(e) =>
                                setSelectedOfficer(e.target.value)
                            }>
                            {officers.map((officer) => (
                                <MenuItem
                                    key={officer._id}
                                    value={officer._id}>
                                    {officer.name} ({officer.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={
                            !selectedDepartment ||
                            !selectedOfficer
                        }
                        onClick={handleAssignOfficer}>
                        Assign Officer
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openWorkerDialog}
                onClose={() => setOpenWorkerDialog(false)}
                fullWidth
                maxWidth="sm"
                className="assignment-dialog">
                <DialogTitle>
                    Assign Worker
                </DialogTitle>

                <DialogContent>
                    <Typography className="dialog-complaint">
                        Complaint:{" "}
                        <strong>
                            {selectedComplaint?.title}
                        </strong>
                    </Typography>

                    <FormControl fullWidth>
                        <InputLabel>Worker</InputLabel>

                        <Select
                            value={selectedWorker}
                            label="Worker"
                            onChange={(e) =>
                                setSelectedWorker(e.target.value)
                            }>
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
                        onClick={() =>
                            setOpenWorkerDialog(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        disabled={!selectedWorker}
                        onClick={handleAssignWorker}>
                        Assign Worker
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminComplaints;