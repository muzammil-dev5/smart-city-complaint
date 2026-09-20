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
    MenuItem,
    Chip,
    Divider,
} from "@mui/material";

import { useEffect, useState } from "react";

import {
    getAllComplaints,
    assignComplaint,
    assignWorker,
} from "../../services/complaintService";

import {
    getOfficers,
    getWorkers,
} from "../../services/userService";

import { getActiveDepartments } from "../../services/departmentService";

import type {
    Complaint,
    Worker,
    Officer,
    Department,
} from "../../types/user";

import "./AdminComplaints.scss";


const formatText = (value?: string) => {
    if (!value) return "Not Available";

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


const AdminComplaints = () => {

    // ================= DATA =================

    const [complaints, setComplaints] =
        useState<Complaint[]>([]);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [officers, setOfficers] =
        useState<Officer[]>([]);

    const [workers, setWorkers] =
        useState<Worker[]>([]);


    // ================= LOADING =================

    const [loading, setLoading] =
        useState(true);

    const [loadingOfficers, setLoadingOfficers] =
        useState(false);

    const [loadingWorkers, setLoadingWorkers] =
        useState(false);

    const [assigningOfficer, setAssigningOfficer] =
        useState(false);

    const [assigningWorker, setAssigningWorker] =
        useState(false);


    // ================= DIALOGS =================

    const [openDialog, setOpenDialog] =
        useState(false);

    const [openWorkerDialog, setOpenWorkerDialog] =
        useState(false);


    // ================= SELECTED DATA =================

    const [selectedComplaint, setSelectedComplaint] =
        useState<Complaint | null>(null);

    const [selectedOfficer, setSelectedOfficer] =
        useState("");

    const [selectedWorker, setSelectedWorker] =
        useState("");

    const [selectedDepartment, setSelectedDepartment] =
        useState("");


    // =====================================================
    // LOAD COMPLAINTS + DEPARTMENTS
    // =====================================================

    const fetchInitialData = async () => {

        try {

            setLoading(true);

            const [
                complaintsResponse,
                departmentsResponse,
            ] = await Promise.all([
                getAllComplaints(),
                getActiveDepartments(),
            ]);

            setComplaints(
                complaintsResponse.complaints || []
            );

            setDepartments(
                departmentsResponse.departments || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch admin data:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchInitialData();
    }, []);


    // =====================================================
    // LOAD OFFICERS BY DEPARTMENT
    // =====================================================

    const loadOfficers = async (
        departmentId: string
    ) => {

        if (!departmentId) {

            setOfficers([]);

            return;
        }

        try {

            setLoadingOfficers(true);

            const response =
                await getOfficers(departmentId);

            setOfficers(
                response.officers || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch officers:",
                error
            );

            setOfficers([]);

        } finally {

            setLoadingOfficers(false);

        }
    };


    // =====================================================
    // LOAD WORKERS BY DEPARTMENT
    // =====================================================

    const loadWorkers = async (
        departmentId: string
    ) => {

        if (!departmentId) {

            setWorkers([]);

            return;
        }

        try {

            setLoadingWorkers(true);

            const response =
                await getWorkers(departmentId);

            setWorkers(
                response.workers || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch workers:",
                error
            );

            setWorkers([]);

        } finally {

            setLoadingWorkers(false);

        }
    };


    // =====================================================
    // OPEN OFFICER DIALOG
    // =====================================================

    const handleOpenOfficerDialog = (
        complaint: Complaint
    ) => {

        setSelectedComplaint(complaint);

        const departmentId =
            complaint.department?._id || "";

        const officerId =
            complaint.assignedOfficer?._id || "";

        setSelectedDepartment(
            departmentId
        );

        setSelectedOfficer(
            officerId
        );

        setOfficers([]);

        setWorkers([]);

        setOpenDialog(true);

        // Existing complaint already has department
        if (departmentId) {
            loadOfficers(departmentId);
        }

    };


    // =====================================================
    // DEPARTMENT CHANGE
    // =====================================================

    const handleDepartmentChange = async (
        departmentId: string
    ) => {

        setSelectedDepartment(
            departmentId
        );

        // Important:
        // Department change means old officer
        // is no longer valid.
        setSelectedOfficer("");

        // Reset workers too.
        setWorkers([]);

        if (!departmentId) {

            setOfficers([]);

            return;
        }

        await loadOfficers(
            departmentId
        );

        // Also load workers for selected department.
        await loadWorkers(
            departmentId
        );
    };


    // =====================================================
    // OFFICER CHANGE
    // =====================================================

    const handleOfficerChange = (
        officerId: string
    ) => {

        setSelectedOfficer(
            officerId
        );

        /*
         * Workers are already filtered
         * by the selected department.
         *
         * So selecting an officer does not
         * need another API request.
         */
    };


    // =====================================================
    // ASSIGN OFFICER
    // =====================================================

    const handleAssignOfficer = async () => {

        if (
            !selectedComplaint ||
            !selectedDepartment ||
            !selectedOfficer
        ) {
            return;
        }

        try {

            setAssigningOfficer(true);

            await assignComplaint(
                selectedComplaint._id,
                selectedDepartment,
                selectedOfficer
            );

            setOpenDialog(false);

            await fetchInitialData();

            setSelectedComplaint(null);

            setSelectedDepartment("");

            setSelectedOfficer("");

            setOfficers([]);

            setWorkers([]);

        } catch (error) {

            console.error(
                "Failed to assign complaint:",
                error
            );

        } finally {

            setAssigningOfficer(false);

        }
    };


    // =====================================================
    // OPEN WORKER DIALOG
    // =====================================================

    const handleOpenWorkerDialog = async (
        complaint: Complaint
    ) => {

        setSelectedComplaint(
            complaint
        );

        setSelectedWorker(
            complaint.worker?._id || ""
        );

        setWorkers([]);

        setOpenWorkerDialog(true);

        const departmentId =
            complaint.department?._id;

        if (departmentId) {

            await loadWorkers(
                departmentId
            );

        }

    };


    // =====================================================
    // ASSIGN WORKER
    // =====================================================

    const handleAssignWorker = async () => {

        if (
            !selectedComplaint ||
            !selectedWorker
        ) {
            return;
        }

        try {

            setAssigningWorker(true);

            await assignWorker(
                selectedComplaint._id,
                selectedWorker
            );

            setOpenWorkerDialog(false);

            await fetchInitialData();

            setSelectedComplaint(null);

            setSelectedWorker("");

            setWorkers([]);

        } catch (error) {

            console.error(
                "Failed to assign worker:",
                error
            );

        } finally {

            setAssigningWorker(false);

        }
    };


    // =====================================================
    // CLOSE OFFICER DIALOG
    // =====================================================

    const handleCloseOfficerDialog = () => {

        if (assigningOfficer) {
            return;
        }

        setOpenDialog(false);

        setSelectedComplaint(null);

        setSelectedDepartment("");

        setSelectedOfficer("");

        setOfficers([]);

        setWorkers([]);
    };


    // =====================================================
    // CLOSE WORKER DIALOG
    // =====================================================

    const handleCloseWorkerDialog = () => {

        if (assigningWorker) {
            return;
        }

        setOpenWorkerDialog(false);

        setSelectedComplaint(null);

        setSelectedWorker("");

        setWorkers([]);
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box className="adminComplaints-loading">

                <CircularProgress />

                <Typography>
                    Loading complaints...
                </Typography>

            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box className="adminComplaints">

            {/* ================= HEADER ================= */}

            <Box className="adminComplaints-header">

                <Box>

                    <Typography
                        className="adminComplaints-title"
                    >
                        All Complaints
                    </Typography>

                    <Typography
                        className="adminComplaints-subtitle"
                    >
                        Review complaints and manage officer
                        and worker assignments.
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


            {/* ================= EMPTY ================= */}

            {complaints.length === 0 ? (

                <Paper className="emptyComplaints">

                    <Typography>
                        No complaints found.
                    </Typography>

                </Paper>

            ) : (

                <Box className="complaints-grid">

                    {complaints.map(
                        (complaint) => (

                            <Paper
                                key={complaint._id}
                                className="complaint-card"
                                elevation={0}
                            >

                                {/* ================= CARD HEADER ================= */}

                                <Box className="complaint-card-header">

                                    <Box className="complaint-card-title-wrapper">

                                        <Typography
                                            className="complaint-card-title"
                                        >
                                            {complaint.title}
                                        </Typography>

                                        <Typography
                                            className="complaint-id"
                                        >
                                            Complaint ID:{" "}
                                            {complaint._id.slice(-8)}
                                        </Typography>

                                    </Box>


                                    <Chip
                                        label={formatText(
                                            complaint.status
                                        )}
                                        className={`status-chip status-${complaint.status}`}
                                    />

                                </Box>


                                <Divider />


                                {/* ================= INFO ================= */}

                                <Box className="complaint-info">

                                    <Box className="info-item">

                                        <Typography className="info-label">
                                            Category
                                        </Typography>

                                        <Typography className="info-value">
                                            {formatText(
                                                complaint.category
                                            )}
                                        </Typography>

                                    </Box>


                                    <Box className="info-item">

                                        <Typography className="info-label">
                                            Citizen
                                        </Typography>

                                        <Typography className="info-value">
                                            {complaint.citizen?.name ||
                                                "Unknown"}
                                        </Typography>

                                    </Box>


                                    <Box className="info-item">

                                        <Typography className="info-label">
                                            Department
                                        </Typography>

                                        <Typography className="info-value">

                                            {complaint.department?.name ||
                                                "Not Assigned"}

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


                                {/* ================= ACTIONS ================= */}

                                <Box className="complaint-actions">

                                    <Button
                                        variant="outlined"
                                        className="assign-officer-btn"
                                        onClick={() =>
                                            handleOpenOfficerDialog(
                                                complaint
                                            )
                                        }
                                    >
                                        {complaint.assignedOfficer
                                            ? "Reassign Officer"
                                            : "Assign Officer"}
                                    </Button>


                                    <Button
                                        variant="contained"
                                        className="assign-worker-btn"
                                        disabled={
                                            !complaint.department
                                        }
                                        onClick={() =>
                                            handleOpenWorkerDialog(
                                                complaint
                                            )
                                        }
                                    >
                                        {complaint.worker
                                            ? "Reassign Worker"
                                            : "Assign Worker"}
                                    </Button>

                                </Box>

                            </Paper>

                        )
                    )}

                </Box>

            )}


            {/* =====================================================
                OFFICER ASSIGNMENT DIALOG
            ===================================================== */}

            <Dialog
                open={openDialog}
                onClose={
                    handleCloseOfficerDialog
                }
                fullWidth
                maxWidth="sm"
                className="assignment-dialog"
            >

                <DialogTitle>
                    {selectedComplaint?.assignedOfficer
                        ? "Reassign Officer"
                        : "Assign Officer"}
                </DialogTitle>


                <DialogContent>

                    <Typography
                        className="dialog-complaint"
                    >
                        Complaint:{" "}
                        <strong>
                            {selectedComplaint?.title}
                        </strong>
                    </Typography>


                    {/* ================= DEPARTMENT ================= */}

                    <FormControl
                        fullWidth
                        sx={{ mb: 2 }}
                    >

                        <InputLabel>
                            Department
                        </InputLabel>

                        <Select
                            value={
                                selectedDepartment
                            }
                            label="Department"
                            onChange={(e) =>
                                handleDepartmentChange(
                                    e.target.value
                                )
                            }
                        >

                            {departments.map(
                                (department) => (

                                    <MenuItem
                                        key={
                                            department._id
                                        }
                                        value={
                                            department._id
                                        }
                                    >
                                        {department.name}
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>


                    {/* ================= OFFICER ================= */}

                    <FormControl
                        fullWidth
                        sx={{ mb: 2 }}
                        disabled={
                            !selectedDepartment ||
                            loadingOfficers
                        }
                    >

                        <InputLabel>
                            Officer
                        </InputLabel>

                        <Select
                            value={
                                selectedOfficer
                            }
                            label="Officer"
                            onChange={(e) =>
                                handleOfficerChange(
                                    e.target.value
                                )
                            }
                        >

                            {loadingOfficers ? (

                                <MenuItem disabled>
                                    Loading officers...
                                </MenuItem>

                            ) : officers.length === 0 ? (

                                <MenuItem disabled>
                                    No officers available
                                </MenuItem>

                            ) : (

                                officers.map(
                                    (officer) => (

                                        <MenuItem
                                            key={
                                                officer._id
                                            }
                                            value={
                                                officer._id
                                            }
                                        >
                                            {officer.name}{" "}
                                            ({officer.email})
                                        </MenuItem>

                                    )
                                )

                            )}

                        </Select>

                    </FormControl>


                    {/* ================= WORKER ================= */}

                    <FormControl
                        fullWidth
                        disabled={
                            !selectedDepartment ||
                            loadingWorkers
                        }
                    >

                        <InputLabel>
                            Worker
                        </InputLabel>

                        <Select
                            value={
                                selectedWorker
                            }
                            label="Worker"
                            onChange={(e) =>
                                setSelectedWorker(
                                    e.target.value
                                )
                            }
                        >

                            {loadingWorkers ? (

                                <MenuItem disabled>
                                    Loading workers...
                                </MenuItem>

                            ) : workers.length === 0 ? (

                                <MenuItem disabled>
                                    No workers available
                                </MenuItem>

                            ) : (

                                workers.map(
                                    (worker) => (

                                        <MenuItem
                                            key={
                                                worker._id
                                            }
                                            value={
                                                worker._id
                                            }
                                        >
                                            {worker.name}{" "}
                                            ({worker.email})
                                        </MenuItem>

                                    )
                                )

                            )}

                        </Select>

                    </FormControl>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={
                            handleCloseOfficerDialog
                        }
                        disabled={
                            assigningOfficer
                        }
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        disabled={
                            !selectedDepartment ||
                            !selectedOfficer ||
                            assigningOfficer
                        }
                        onClick={
                            handleAssignOfficer
                        }
                    >
                        {assigningOfficer
                            ? "Assigning..."
                            : "Assign Officer"}
                    </Button>

                </DialogActions>

            </Dialog>


            {/* =====================================================
                WORKER ASSIGNMENT DIALOG
            ===================================================== */}

            <Dialog
                open={openWorkerDialog}
                onClose={
                    handleCloseWorkerDialog
                }
                fullWidth
                maxWidth="sm"
                className="assignment-dialog"
            >

                <DialogTitle>
                    {selectedComplaint?.worker
                        ? "Reassign Worker"
                        : "Assign Worker"}
                </DialogTitle>


                <DialogContent>

                    <Typography
                        className="dialog-complaint"
                    >
                        Complaint:{" "}
                        <strong>
                            {selectedComplaint?.title}
                        </strong>
                    </Typography>


                    <FormControl
                        fullWidth
                        disabled={loadingWorkers}
                    >

                        <InputLabel>
                            Worker
                        </InputLabel>

                        <Select
                            value={
                                selectedWorker
                            }
                            label="Worker"
                            onChange={(e) =>
                                setSelectedWorker(
                                    e.target.value
                                )
                            }
                        >

                            {loadingWorkers ? (

                                <MenuItem disabled>
                                    Loading workers...
                                </MenuItem>

                            ) : workers.length === 0 ? (

                                <MenuItem disabled>
                                    No workers available for this department
                                </MenuItem>

                            ) : (

                                workers.map(
                                    (worker) => (

                                        <MenuItem
                                            key={
                                                worker._id
                                            }
                                            value={
                                                worker._id
                                            }
                                        >
                                            {worker.name}{" "}
                                            ({worker.email})
                                        </MenuItem>

                                    )
                                )

                            )}

                        </Select>

                    </FormControl>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={
                            handleCloseWorkerDialog
                        }
                        disabled={
                            assigningWorker
                        }
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        disabled={
                            !selectedWorker ||
                            assigningWorker
                        }
                        onClick={
                            handleAssignWorker
                        }
                    >
                        {assigningWorker
                            ? "Assigning..."
                            : "Assign Worker"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};


export default AdminComplaints;