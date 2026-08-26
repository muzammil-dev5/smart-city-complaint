import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Stack, Divider
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import { useEffect, useState } from "react";
import { createDepartment, getAllDepartments, updateDepartment } from "../../services/departmentService";
import type { Department } from "../../types/user";
import "./AdminDepartment.scss";

const AdminDepartments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const loadDepartments = async () => {
        try {
            const response = await getAllDepartments();
            setDepartments(response.departments);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
        }
    };

    useEffect(() => {
        const fetchInitialDepartments = async () => {
            try {
                const response = await getAllDepartments();
                setDepartments(response.departments);
            } catch (error) {
                console.error("Failed to fetch departments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialDepartments();
    }, []);

    const handleCreateDepartment = async () => {
        if (!name.trim()) {
            return;
        }

        try {
            await createDepartment({
                name: name.trim(),
                description: description.trim()
            });
            setName("");
            setDescription("");
            setOpenDialog(false);
            await loadDepartments();

        } catch (error) {
            console.error("Failed to create department:", error);
        }
    };

    const handleToggleStatus = async (department: Department) => {
        try {
            await updateDepartment(
                department._id,
                {
                    isActive: !department.isActive
                }
            );
            await loadDepartments();
        } catch (error) {
            console.error("Failed to update department status:", error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setName("");
        setDescription("");
    };

    if (loading) {
        return (
            <Box className="adminDepartments-loading">
                <Typography>
                    Loading departments...
                </Typography>
            </Box>);
    }

    const activeDepartments = departments.filter((department) => department.isActive).length;
    const inactiveDepartments = departments.filter((department) => !department.isActive).length;

    return (
        <Box className="adminDepartments">
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
                            Manage city departments and their availability.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    className="adminDepartments-addBtn"
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={() => setOpenDialog(true)}>
                    Add Department
                </Button>
            </Box>

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

            <Paper className="adminDepartments-tableCard">
                <Box className="adminDepartments-tableHeader">
                    <Box>
                        <Typography className="table-title">
                            All Departments
                        </Typography>

                        <Typography className="table-subtitle">
                            View and manage all registered departments.
                        </Typography>
                    </Box>

                    <Chip
                        label={`${departments.length} Departments`}
                        className="department-count-chip"
                    />
                </Box>

                <Divider />

                <TableContainer>
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
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {departments.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center">
                                        <Box className="empty-departments">
                                            <BusinessOutlinedIcon />
                                            <Typography>
                                                No departments found.
                                            </Typography>

                                            <Typography variant="body2">
                                                Add your first department to get started.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departments.map((department) => (
                                    <TableRow
                                        key={department._id}
                                        className="department-row">

                                        <TableCell>
                                            <Box className="department-name-wrapper">
                                                <Box className="department-row-icon">
                                                    <BusinessOutlinedIcon />
                                                </Box>

                                                <Box>
                                                    <Typography className="department-name">
                                                        {department.name}
                                                    </Typography>

                                                    <Typography className="department-id">
                                                        Department
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography className="department-description">
                                                {department.description ||
                                                    "No description available"}

                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                icon={
                                                    department.isActive
                                                        ? <CheckCircleOutlineOutlinedIcon />
                                                        : <BlockOutlinedIcon />
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

                                        <TableCell align="right">
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
                                                        department)}>

                                                {department.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}

                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
                className="adminDepartment-dialog">

                <DialogTitle>
                    <Box className="dialog-header">
                        <Box className="dialog-icon">
                            <BusinessOutlinedIcon />
                        </Box>

                        <Box>
                            <Typography className="dialog-title">
                                Add Department
                            </Typography>

                            <Typography className="dialog-subtitle">
                                Create a new city department.
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Department Name"
                            placeholder="e.g. Sanitation Department"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            placeholder="Enter department description..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions className="dialog-actions">
                    <Button
                        className="dialog-cancel-btn"
                        onClick={handleCloseDialog}>
                        Cancel
                    </Button>

                    <Button
                        className="dialog-submit-btn"
                        variant="contained"
                        disabled={!name.trim()}
                        onClick={handleCreateDepartment}
                        startIcon={<AddOutlinedIcon />}>
                        Add Department
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDepartments;