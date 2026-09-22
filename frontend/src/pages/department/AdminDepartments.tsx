import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, } from "@mui/material";
import { AxiosError } from "axios";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useEffect, useState } from "react";
import { createDepartment, deleteDepartment, getAllDepartments, updateDepartment, } from "../../services/departmentService";
import type { Department } from "../../types/user";
import "./AdminDepartment.scss";

const AdminDepartments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deleteDepartmentData, setDeleteDepartmentData] = useState<Department | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadDepartments = async () => {
        try {
            const response = await getAllDepartments();

            setDepartments(response.departments || []);
        } catch (error) {
            console.error(
                "Failed to fetch departments:",
                error
            );

            setErrorMessage(
                "Failed to load departments."
            );
        }
    };

    /*
     * Initial load
     */
    useEffect(() => {
        const fetchInitialDepartments = async () => {
            try {
                const response = await getAllDepartments();

                setDepartments(response.departments || []);
            } catch (error) {
                console.error(
                    "Failed to fetch departments:",
                    error
                );

                setErrorMessage(
                    "Failed to load departments."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInitialDepartments();
    }, []);

    /*
     * Open create dialog
     */
    const handleOpenCreateDialog = () => {
        setEditingDepartment(null);
        setName("");
        setDescription("");
        setErrorMessage("");
        setOpenDialog(true);
    };

    /*
     * Open edit dialog
     */
    const handleEditDepartment = (
        department: Department
    ) => {
        setEditingDepartment(department);

        setName(department.name);

        setDescription(
            department.description || ""
        );

        setErrorMessage("");

        setOpenDialog(true);
    };

    /*
     * Close create/edit dialog
     */
    const handleCloseDialog = () => {
        if (actionLoading) {
            return;
        }

        setOpenDialog(false);

        setName("");
        setDescription("");

        setEditingDepartment(null);

        setErrorMessage("");
    };

    /*
     * Create / Update department
     */
    const handleSaveDepartment = async () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setErrorMessage(
                "Department name is required."
            );

            return;
        }

        try {
            setActionLoading(true);
            setErrorMessage("");

            if (editingDepartment) {
                await updateDepartment(
                    editingDepartment._id,
                    {
                        name: trimmedName,
                        description:
                            description.trim(),
                    }
                );
            } else {
                await createDepartment({
                    name: trimmedName,
                    description:
                        description.trim(),
                });
            }

            handleCloseDialog();

            await loadDepartments();
        } catch (error: unknown) {
            console.error("Failed to save department:", error);

            const message =
                error &&
                    typeof error === "object" &&
                    "response" in error &&
                    error.response &&
                    typeof error.response === "object" &&
                    "data" in error.response &&
                    error.response.data &&
                    typeof error.response.data === "object" &&
                    "message" in error.response.data
                    ? String(error.response.data.message)
                    : "Failed to save department.";

            setErrorMessage(message);
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * Toggle active/inactive status
     */
    const handleToggleStatus = async (
        department: Department
    ) => {
        try {
            setActionLoading(true);
            setErrorMessage("");

            await updateDepartment(
                department._id,
                {
                    isActive:
                        !department.isActive,
                }
            );

            await loadDepartments();
        } catch (error: unknown) {
            console.error(
                "Failed to update department status:",
                error
            );

            const axiosError = error as AxiosError<{ message?: string }>;

            const message =
                axiosError.response?.data?.message ||
                "Failed to update department status.";

            setErrorMessage(message);
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * Open delete confirmation
     */
    const handleOpenDeleteDialog = (
        department: Department
    ) => {
        setDeleteDepartmentData(department);
        setErrorMessage("");
    };

    /*
     * Close delete confirmation
     */
    const handleCloseDeleteDialog = () => {
        if (actionLoading) {
            return;
        }

        setDeleteDepartmentData(null);
        setErrorMessage("");
    };

    /*
     * Delete department
     */
    const handleDeleteDepartment = async () => {
        if (!deleteDepartmentData) {
            return;
        }

        try {
            setActionLoading(true);
            setErrorMessage("");

            await deleteDepartment(
                deleteDepartmentData._id
            );

            setDeleteDepartmentData(null);

            await loadDepartments();
        } catch (error: unknown) {
            console.error(
                "Failed to delete department:",
                error
            );

            const axiosError = error as AxiosError<{ message?: string }>;

            const message =
                axiosError.response?.data?.message ||
                "Failed to delete department.";

            setErrorMessage(message);
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * Loading state
     */
    if (loading) {
        return (
            <Box className="adminDepartments-loading">
                <BusinessOutlinedIcon />

                <Typography>
                    Loading departments...
                </Typography>
            </Box>
        );
    }

    /*
     * Department statistics
     */
    const activeDepartments =
        departments.filter(
            (department) =>
                department.isActive
        ).length;

    const inactiveDepartments =
        departments.filter(
            (department) =>
                !department.isActive
        ).length;

    return (
        <Box className="adminDepartments">

            {/* ================= HEADER ================= */}

            <Box className="adminDepartments-header">

                <Box className="adminDepartments-header-content">

                    <Box className="adminDepartments-icon">
                        <BusinessOutlinedIcon />
                    </Box>

                    <Box>
                        <Typography className="adminDepartments-title">
                            Department Management
                        </Typography>

                        <Typography className="adminDepartments-subtitle">
                            Manage city departments and
                            their availability.
                        </Typography>
                    </Box>

                </Box>

                <Button
                    className="adminDepartments-addBtn"
                    variant="contained"
                    startIcon={
                        <AddOutlinedIcon />
                    }
                    onClick={
                        handleOpenCreateDialog
                    }
                    disabled={actionLoading}
                >
                    Add Department
                </Button>

            </Box>

            {/* ================= ERROR ================= */}

            {errorMessage && (
                <Box className="adminDepartments-error">
                    <Typography>
                        {errorMessage}
                    </Typography>
                </Box>
            )}

            {/* ================= STATS ================= */}

            <Box className="adminDepartments-stats">

                <Paper className="department-stat-card">

                    <Box className="department-stat-icon total">
                        <BusinessOutlinedIcon />
                    </Box>

                    <Box>
                        <Typography className="department-stat-label">
                            Total Departments
                        </Typography>

                        <Typography className="department-stat-value">
                            {departments.length}
                        </Typography>
                    </Box>

                </Paper>

                <Paper className="department-stat-card">

                    <Box className="department-stat-icon active">
                        <CheckCircleOutlineOutlinedIcon />
                    </Box>

                    <Box>
                        <Typography className="department-stat-label">
                            Active Departments
                        </Typography>

                        <Typography className="department-stat-value">
                            {activeDepartments}
                        </Typography>
                    </Box>

                </Paper>

                <Paper className="department-stat-card">

                    <Box className="department-stat-icon inactive">
                        <BlockOutlinedIcon />
                    </Box>

                    <Box>
                        <Typography className="department-stat-label">
                            Inactive Departments
                        </Typography>

                        <Typography className="department-stat-value">
                            {inactiveDepartments}
                        </Typography>
                    </Box>

                </Paper>

            </Box>

            {/* ================= TABLE ================= */}

            <Paper className="adminDepartments-tableCard">

                <Box className="adminDepartments-tableHeader">

                    <Box>
                        <Typography className="table-title">
                            All Departments
                        </Typography>

                        <Typography className="table-subtitle">
                            View and manage all registered
                            departments.
                        </Typography>
                    </Box>

                    <Chip
                        label={`${departments.length} Departments`}
                        className="department-count-chip"
                    />

                </Box>

                <Divider />

                <TableContainer className="adminDepartments-tableContainer">

                    <Table className="adminDepartments-table">

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    Department
                                </TableCell>

                                <TableCell>
                                    Description
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell align="right">
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {departments.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                    >

                                        <Box className="empty-departments">

                                            <BusinessOutlinedIcon />

                                            <Typography>
                                                No departments
                                                found.
                                            </Typography>

                                            <Typography variant="body2">
                                                Add your first
                                                department to
                                                get started.
                                            </Typography>

                                        </Box>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                departments.map(
                                    (department) => (

                                        <TableRow
                                            key={
                                                department._id
                                            }
                                            className="department-row"
                                        >

                                            {/* Department */}

                                            <TableCell>

                                                <Box className="department-name-wrapper">

                                                    <Box className="department-row-icon">
                                                        <BusinessOutlinedIcon />
                                                    </Box>

                                                    <Box className="department-name-content">

                                                        <Typography className="department-name">
                                                            {
                                                                department.name
                                                            }
                                                        </Typography>

                                                        <Typography className="department-id">
                                                            Department
                                                        </Typography>

                                                    </Box>

                                                </Box>

                                            </TableCell>

                                            {/* Description */}

                                            <TableCell>

                                                <Typography className="department-description">
                                                    {
                                                        department.description ||
                                                        "No description available"
                                                    }
                                                </Typography>

                                            </TableCell>

                                            {/* Status */}

                                            <TableCell>

                                                <Chip
                                                    icon={
                                                        department.isActive ? (
                                                            <CheckCircleOutlineOutlinedIcon />
                                                        ) : (
                                                            <BlockOutlinedIcon />
                                                        )
                                                    }
                                                    label={
                                                        department.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    className={
                                                        department.isActive
                                                            ? "status-chip active"
                                                            : "status-chip inactive"
                                                    }
                                                />

                                            </TableCell>

                                            {/* Actions */}

                                            <TableCell align="right">

                                                <Box className="department-actions">

                                                    <Button
                                                        className="department-action edit"
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={
                                                            <EditOutlinedIcon />
                                                        }
                                                        onClick={() =>
                                                            handleEditDepartment(
                                                                department
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        className={
                                                            department.isActive
                                                                ? "department-action deactivate"
                                                                : "department-action activate"
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={
                                                            <PowerSettingsNewOutlinedIcon />
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                department
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >
                                                        {
                                                            department.isActive
                                                                ? "Deactivate"
                                                                : "Activate"
                                                        }
                                                    </Button>

                                                    <Button
                                                        className="department-action delete"
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={
                                                            <DeleteOutlineOutlinedIcon />
                                                        }
                                                        onClick={() =>
                                                            handleOpenDeleteDialog(
                                                                department
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >
                                                        Delete
                                                    </Button>

                                                </Box>

                                            </TableCell>

                                        </TableRow>

                                    )
                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>

            {/* ================= CREATE / EDIT DIALOG ================= */}

            <Dialog
                open={openDialog}
                onClose={
                    handleCloseDialog
                }
                fullWidth
                maxWidth="sm"
                className="adminDepartment-dialog"
            >

                <DialogTitle>

                    <Box className="dialog-header">

                        <Box className="dialog-icon">
                            {editingDepartment ? (
                                <EditOutlinedIcon />
                            ) : (
                                <BusinessOutlinedIcon />
                            )}
                        </Box>

                        <Box>

                            <Typography className="dialog-title">

                                {editingDepartment
                                    ? "Edit Department"
                                    : "Add Department"}

                            </Typography>

                            <Typography className="dialog-subtitle">

                                {editingDepartment
                                    ? "Update department information."
                                    : "Create a new city department."}

                            </Typography>

                        </Box>

                    </Box>

                </DialogTitle>

                <DialogContent>

                    <Stack
                        spacing={2.5}
                        sx={{ mt: 1 }}
                    >

                        <TextField
                            fullWidth
                            label="Department Name"
                            placeholder="e.g. Sanitation Department"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            disabled={
                                actionLoading
                            }
                            autoFocus
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label="Description"
                            placeholder="Enter department description..."
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            disabled={
                                actionLoading
                            }
                        />

                        {errorMessage && (
                            <Typography className="dialog-error">
                                {errorMessage}
                            </Typography>
                        )}

                    </Stack>

                </DialogContent>

                <DialogActions className="dialog-actions">

                    <Button
                        className="dialog-cancel-btn"
                        onClick={
                            handleCloseDialog
                        }
                        disabled={
                            actionLoading
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        className="dialog-submit-btn"
                        variant="contained"
                        disabled={
                            !name.trim() ||
                            actionLoading
                        }
                        onClick={
                            handleSaveDepartment
                        }
                        startIcon={
                            editingDepartment ? (
                                <EditOutlinedIcon />
                            ) : (
                                <AddOutlinedIcon />
                            )
                        }
                    >
                        {actionLoading
                            ? "Saving..."
                            : editingDepartment
                                ? "Save Changes"
                                : "Add Department"}
                    </Button>

                </DialogActions>

            </Dialog>

            {/* ================= DELETE DIALOG ================= */}

            <Dialog
                open={
                    Boolean(
                        deleteDepartmentData
                    )
                }
                onClose={
                    handleCloseDeleteDialog
                }
                fullWidth
                maxWidth="xs"
                className="deleteDepartment-dialog"
            >

                <DialogTitle>

                    <Box className="delete-dialog-header">

                        <Box className="delete-dialog-icon">
                            <WarningAmberOutlinedIcon />
                        </Box>

                        <Box>

                            <Typography className="delete-dialog-title">
                                Delete Department
                            </Typography>

                            <Typography className="delete-dialog-subtitle">
                                This action requires confirmation
                            </Typography>

                        </Box>

                    </Box>

                </DialogTitle>

                <DialogContent>

                    <DialogContentText className="delete-dialog-message">

                        Are you sure you want to delete{" "}

                        <strong>
                            {
                                deleteDepartmentData?.name
                            }
                        </strong>

                        ?

                    </DialogContentText>

                    <Box className="delete-dialog-warning">

                        <Typography>
                            This action cannot be undone.
                            Departments with assigned
                            complaints cannot be deleted.
                        </Typography>

                    </Box>

                    {errorMessage && (
                        <Typography className="delete-dialog-error">
                            {errorMessage}
                        </Typography>
                    )}

                </DialogContent>

                <DialogActions className="delete-dialog-actions">

                    <Button
                        className="delete-dialog-cancel"
                        onClick={
                            handleCloseDeleteDialog
                        }
                        disabled={
                            actionLoading
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        className="delete-dialog-confirm"
                        variant="contained"
                        onClick={
                            handleDeleteDepartment
                        }
                        disabled={
                            actionLoading
                        }
                        startIcon={
                            <DeleteOutlineOutlinedIcon />
                        }
                    >
                        {actionLoading
                            ? "Deleting..."
                            : "Delete"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};

export default AdminDepartments;