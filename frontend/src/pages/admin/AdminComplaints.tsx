import { Box, Paper, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, DialogActions, MenuItem, Chip, Divider, } from "@mui/material";
import { AssignmentOutlined, PendingActionsOutlined, FactCheckOutlined, EngineeringOutlined, CheckCircle, CancelOutlined, FilterAltOutlined, Person2Outlined, BusinessOutlined, BadgeOutlined, HandymanOutlined, } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { getAllComplaints, assignComplaint, } from "../../services/complaintService";

import {
    getOfficers,
} from "../../services/userService";

import { getActiveDepartments } from "../../services/departmentService";

import type {
    Complaint,
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

type StatusFilter =
    | "all"
    | "pending"
    | "assigned"
    | "in_progress"
    | "resolved"
    | "rejected";

const statusCards: {
    key: StatusFilter;
    label: string;
    icon: React.ReactNode;
}[] = [
        {
            key: "all",
            label: "All Complaints",
            icon: <AssignmentOutlined />,
        },
        {
            key: "pending",
            label: "Pending",
            icon: <PendingActionsOutlined />,
        },
        {
            key: "assigned",
            label: "Assigned",
            icon: <FactCheckOutlined />,
        },
        {
            key: "in_progress",
            label: "In Progress",
            icon: <EngineeringOutlined />,
        },
        {
            key: "resolved",
            label: "Resolved",
            icon: <CheckCircle />,
        },
        {
            key: "rejected",
            label: "Rejected",
            icon: <CancelOutlined />,
        },
    ];

const AdminComplaints = () => {
    const [complaints, setComplaints] =
        useState<Complaint[]>([]);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [officers, setOfficers] =
        useState<Officer[]>([]);

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [departmentFilter, setDepartmentFilter] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [loadingOfficers, setLoadingOfficers] =
        useState(false);

    const [assigningOfficer, setAssigningOfficer] =
        useState(false);

    const [openOfficerDialog, setOpenOfficerDialog] =
        useState(false);

    const [selectedComplaint, setSelectedComplaint] =
        useState<Complaint | null>(null);

    const [selectedDepartment, setSelectedDepartment] =
        useState("");

    const [selectedOfficer, setSelectedOfficer] =
        useState("");

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
                "Failed to fetch admin complaints data:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const statusCounts = useMemo(() => {
        return {
            all: complaints.length,

            pending: complaints.filter(
                (complaint) =>
                    complaint.status === "pending"
            ).length,

            assigned: complaints.filter(
                (complaint) =>
                    complaint.status === "assigned"
            ).length,

            in_progress: complaints.filter(
                (complaint) =>
                    complaint.status === "in_progress"
            ).length,

            resolved: complaints.filter(
                (complaint) =>
                    complaint.status === "resolved"
            ).length,

            rejected: complaints.filter(
                (complaint) =>
                    complaint.status === "rejected"
            ).length,
        };
    }, [complaints]);

    const filteredComplaints = useMemo(() => {
        return [...complaints]
            .sort((a, b) => {
                const dateA = new Date(
                    a.createdAt || 0
                ).getTime();

                const dateB = new Date(
                    b.createdAt || 0
                ).getTime();

                return dateB - dateA;
            })
            .filter((complaint) => {
                const statusMatches =
                    statusFilter === "all" ||
                    complaint.status === statusFilter;

                const departmentMatches =
                    departmentFilter === "all" ||
                    complaint.department?._id ===
                    departmentFilter;

                return (
                    statusMatches &&
                    departmentMatches
                );
            });
    }, [
        complaints,
        statusFilter,
        departmentFilter,
    ]);

    // =====================================================
    // LOAD OFFICERS
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

        setOpenOfficerDialog(true);

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

        setSelectedOfficer("");
        setOfficers([]);

        if (!departmentId) {
            return;
        }

        await loadOfficers(
            departmentId
        );
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

            handleCloseOfficerDialog();

            await fetchInitialData();

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
    // CLOSE OFFICER DIALOG
    // =====================================================

    const handleCloseOfficerDialog = () => {
        if (assigningOfficer) {
            return;
        }

        setOpenOfficerDialog(false);

        setSelectedComplaint(null);

        setSelectedDepartment("");

        setSelectedOfficer("");

        setOfficers([]);
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

    return (
        <Box className="adminComplaints">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box className="adminComplaints-header">

                <Box>

                    <Box className="page-heading-row">

                        <Box className="page-heading-icon">
                            <AssignmentOutlined />
                        </Box>

                        <Box>

                            <Typography className="adminComplaints-title">
                                All Complaints
                            </Typography>

                            <Typography className="adminComplaints-subtitle">
                                Review complaints and manage
                                department and officer assignments.
                            </Typography>

                        </Box>

                    </Box>

                </Box>

                <Box className="adminComplaints-total">

                    <Typography className="total-number">
                        {complaints.length}
                    </Typography>

                    <Typography className="total-label">
                        Total Complaints
                    </Typography>

                </Box>

            </Box>

            {/* =====================================================
                STATUS CARDS
            ===================================================== */}

            <Box className="status-summary">

                {statusCards.map((status) => (

                    <Box
                        key={status.key}
                        className={`status-summary-card ${statusFilter === status.key
                            ? "active"
                            : ""
                            } status-card-${status.key}`}
                        onClick={() =>
                            setStatusFilter(
                                status.key
                            )
                        }
                    >

                        <Box className="status-summary-top">

                            <Box className="status-summary-icon">
                                {status.icon}
                            </Box>

                            <Typography className="status-summary-count">
                                {
                                    statusCounts[
                                    status.key
                                    ]
                                }
                            </Typography>

                        </Box>

                        <Typography className="status-summary-label">
                            {status.label}
                        </Typography>

                        <Box className="status-summary-line" />

                    </Box>

                ))}

            </Box>

            {/* =====================================================
                FILTER BAR
            ===================================================== */}

            <Paper
                className="complaint-filter-bar"
                elevation={0}
            >

                <Box className="filter-heading">

                    <Box className="filter-heading-icon">
                        <FilterAltOutlined />
                    </Box>

                    <Box>

                        <Typography className="filter-title">
                            Filter Complaints
                        </Typography>

                        <Typography className="filter-subtitle">
                            Narrow results by department
                        </Typography>

                    </Box>

                </Box>

                <FormControl className="department-filter">

                    <InputLabel>
                        Department
                    </InputLabel>

                    <Select
                        value={
                            departmentFilter
                        }
                        label="Department"
                        onChange={(e) =>
                            setDepartmentFilter(
                                e.target.value
                            )
                        }
                    >

                        <MenuItem value="all">
                            All Departments
                        </MenuItem>

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
                                    {
                                        department.name
                                    }
                                </MenuItem>

                            )
                        )}

                    </Select>

                </FormControl>

                <Box className="results-info">

                    <Typography>
                        Showing
                    </Typography>

                    <strong>
                        {filteredComplaints.length}
                    </strong>

                    <Typography>
                        complaints
                    </Typography>

                </Box>

            </Paper>

            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

            {filteredComplaints.length === 0 ? (

                <Paper
                    className="emptyComplaints"
                    elevation={0}
                >

                    <Box className="empty-icon">
                        <AssignmentOutlined />
                    </Box>

                    <Typography className="empty-title">
                        No complaints found
                    </Typography>

                    <Typography className="empty-description">
                        There are no complaints matching
                        the selected filters.
                    </Typography>

                </Paper>

            ) : (

                <Box className="complaints-grid">

                    {filteredComplaints.map(
                        (complaint) => (

                            <Paper
                                key={
                                    complaint._id
                                }
                                className="complaint-card"
                                elevation={0}
                            >

                                {/* =====================================================
                                    CARD HEADER
                                ===================================================== */}

                                <Box className="complaint-card-header">

                                    <Box className="complaint-card-title-wrapper">

                                        <Box className="complaint-title-row">

                                            <Box className="complaint-title-dot" />

                                            <Typography
                                                className="complaint-card-title"
                                            >
                                                {
                                                    complaint.title
                                                }
                                            </Typography>

                                        </Box>

                                        <Typography className="complaint-id">
                                            ID:{" "}
                                            {complaint._id.slice(
                                                -8
                                            )}
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

                                {/* =====================================================
                                    COMPLAINT INFORMATION
                                ===================================================== */}

                                <Box className="complaint-info">

                                    <Box className="info-item">

                                        <Box className="info-icon">
                                            <BadgeOutlined />
                                        </Box>

                                        <Box className="info-content">

                                            <Typography className="info-label">
                                                Category
                                            </Typography>

                                            <Typography className="info-value">
                                                {formatText(
                                                    complaint.category
                                                )}
                                            </Typography>

                                        </Box>

                                    </Box>

                                    <Box className="info-item">

                                        <Box className="info-icon">
                                            <Person2Outlined />
                                        </Box>

                                        <Box className="info-content">

                                            <Typography className="info-label">
                                                Citizen
                                            </Typography>

                                            <Typography className="info-value">
                                                {
                                                    complaint
                                                        .citizen
                                                        ?.name
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                    <Box className="info-item">

                                        <Box className="info-icon">
                                            <BusinessOutlined />
                                        </Box>

                                        <Box className="info-content">

                                            <Typography className="info-label">
                                                Department
                                            </Typography>

                                            <Typography className="info-value">
                                                {
                                                    complaint
                                                        .department
                                                        ?.name ||
                                                    "Not Assigned"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                    <Box className="info-item">

                                        <Box className="info-icon">
                                            <Person2Outlined />
                                        </Box>

                                        <Box className="info-content">

                                            <Typography className="info-label">
                                                Officer
                                            </Typography>

                                            <Typography className="info-value">
                                                {
                                                    complaint
                                                        .assignedOfficer
                                                        ?.name ||
                                                    "Not Assigned"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                    <Box className="info-item">

                                        <Box className="info-icon">
                                            <HandymanOutlined />
                                        </Box>

                                        <Box className="info-content">

                                            <Typography className="info-label">
                                                Worker
                                            </Typography>

                                            <Typography className="info-value">
                                                {
                                                    complaint
                                                        .worker
                                                        ?.name ||
                                                    "Not Assigned"
                                                }
                                            </Typography>

                                        </Box>

                                    </Box>

                                </Box>

                                {/* =====================================================
                                    ACTIONS
                                ===================================================== */}

                                <Box className="complaint-actions">

                                    <Button
                                        variant="outlined"
                                        className="assign-officer-btn"
                                        onClick={() =>
                                            handleOpenOfficerDialog(
                                                complaint
                                            )
                                        }
                                        disabled={
                                            complaint.status ===
                                            "resolved"
                                        }
                                        startIcon={
                                            <Person2Outlined />
                                        }
                                    >
                                        {complaint.assignedOfficer
                                            ? "Reassign Officer"
                                            : "Assign Officer"}
                                    </Button>

                                </Box>

                            </Paper>

                        )
                    )}

                </Box>

            )}

            {/* =====================================================
                OFFICER DIALOG
            ===================================================== */}

            <Dialog
                open={openOfficerDialog}
                onClose={
                    handleCloseOfficerDialog
                }
                fullWidth
                maxWidth="sm"
                className="assignment-dialog"
            >

                <DialogTitle>

                    <Box className="dialog-title-wrapper">

                        <Box className="dialog-title-icon officer">
                            <Person2Outlined />
                        </Box>

                        <Box>

                            <Typography className="dialog-title">
                                {selectedComplaint?.assignedOfficer
                                    ? "Reassign Officer"
                                    : "Assign Officer"}
                            </Typography>

                            <Typography className="dialog-subtitle">
                                Select the department and
                                officer responsible for
                                this complaint.
                            </Typography>

                        </Box>

                    </Box>

                </DialogTitle>

                <DialogContent>

                    <Box className="dialog-complaint-card">

                        <Typography className="dialog-complaint-label">
                            Complaint
                        </Typography>

                        <Typography className="dialog-complaint-title">
                            {selectedComplaint?.title}
                        </Typography>

                        <Typography className="dialog-complaint-id">
                            ID:{" "}
                            {selectedComplaint?._id.slice(
                                -8
                            )}
                        </Typography>

                    </Box>

                    <FormControl
                        fullWidth
                        className="dialog-field"
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
                                        {
                                            department.name
                                        }
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                    <FormControl
                        fullWidth
                        className="dialog-field"
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
                                setSelectedOfficer(
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
                                            {
                                                officer.name
                                            }{" "}
                                            (
                                            {
                                                officer.email
                                            }
                                            )
                                        </MenuItem>

                                    )
                                )

                            )}

                        </Select>

                    </FormControl>

                </DialogContent>

                <DialogActions>

                    <Button
                        className="dialog-cancel-btn"
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
                        className="dialog-confirm-btn"
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
                            : selectedComplaint?.assignedOfficer
                                ? "Reassign Officer"
                                : "Assign Officer"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};

export default AdminComplaints;
