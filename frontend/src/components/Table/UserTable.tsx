import {
    TableContainer,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";

import type { User, Department } from "../../types/user";

import { useEffect, useState } from "react";

import {
    updateUserRole,
    updateUserStatus,
    updateUserDepartment,
} from "../../services/userService";

import { getActiveDepartments } from "../../services/departmentService";

import "./UserTable.scss";

type UserTableProps = {
    users: User[];

    onRoleUpdated: (
        userId: string,
        role: User["role"]
    ) => void;

    onStatusUpdated: (
        userId: string,
        isActive: boolean
    ) => void;

    onDepartmentUpdated: (
        userId: string,
        department: User["department"]
    ) => void;

    currentUserId: string;
};

const UserTable = ({
    users,
    onRoleUpdated,
    onStatusUpdated,
    onDepartmentUpdated,
    currentUserId,
}: UserTableProps) => {

    // ================= ROLE =================

    const [openDialog, setOpenDialog] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const [selectedRole, setSelectedRole] =
        useState<User["role"]>("citizen");

    const [updatingRole, setUpdatingRole] =
        useState(false);


    // ================= STATUS =================

    const [openStatusDialog, setOpenStatusDialog] =
        useState(false);

    const [statusUser, setStatusUser] =
        useState<User | null>(null);

    const [updatingStatus, setUpdatingStatus] =
        useState(false);


    // ================= DEPARTMENT =================

    const [openDepartmentDialog, setOpenDepartmentDialog] =
        useState(false);

    const [departmentUser, setDepartmentUser] =
        useState<User | null>(null);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [selectedDepartment, setSelectedDepartment] =
        useState("");

    const [loadingDepartments, setLoadingDepartments] =
        useState(false);

    const [updatingDepartment, setUpdatingDepartment] =
        useState(false);


    // ================= ROLE DIALOG =================

    const handleOpenRoleDialog = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setOpenDialog(true);
    };

    const handleCloseRoleDialog = () => {
        if (updatingRole) return;

        setOpenDialog(false);
        setSelectedUser(null);
    };


    // ================= STATUS DIALOG =================

    const handleOpenStatusDialog = (user: User) => {
        setStatusUser(user);
        setOpenStatusDialog(true);
    };

    const handleCloseStatusDialog = () => {
        if (updatingStatus) return;

        setOpenStatusDialog(false);
        setStatusUser(null);
    };


    // ================= DEPARTMENT DIALOG =================

    const handleOpenDepartmentDialog = (user: User) => {
        setDepartmentUser(user);

        setSelectedDepartment(
            user.department?._id || ""
        );

        setOpenDepartmentDialog(true);
    };

    const handleCloseDepartmentDialog = () => {
        if (updatingDepartment) return;

        setOpenDepartmentDialog(false);
        setDepartmentUser(null);
        setSelectedDepartment("");
    };


    // ================= LOAD DEPARTMENTS =================

    useEffect(() => {

        if (!openDepartmentDialog) {
            return;
        }

        const fetchDepartments = async () => {

            try {

                setLoadingDepartments(true);

                const response =
                    await getActiveDepartments();

                setDepartments(
                    response.departments || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch departments:",
                    error
                );

            } finally {

                setLoadingDepartments(false);

            }
        };

        fetchDepartments();

    }, [openDepartmentDialog]);


    // ================= UPDATE ROLE =================

    const handleUpdateRole = async () => {

        if (!selectedUser) return;

        try {

            setUpdatingRole(true);

            await updateUserRole(
                selectedUser._id,
                selectedRole
            );

            onRoleUpdated(
                selectedUser._id,
                selectedRole
            );

            handleCloseRoleDialog();

        } catch (error) {

            console.error(
                "Failed to update user role:",
                error
            );

        } finally {

            setUpdatingRole(false);

        }
    };


    // ================= UPDATE STATUS =================

    const handleUpdateStatus = async () => {

        if (!statusUser) return;

        const newStatus =
            !statusUser.isActive;

        try {

            setUpdatingStatus(true);

            await updateUserStatus(
                statusUser._id,
                newStatus
            );

            onStatusUpdated(
                statusUser._id,
                newStatus
            );

            handleCloseStatusDialog();

        } catch (error) {

            console.error(
                "Failed to update user status:",
                error
            );

        } finally {

            setUpdatingStatus(false);

        }
    };


    // ================= UPDATE DEPARTMENT =================

    const handleUpdateDepartment = async () => {

        if (
            !departmentUser ||
            !selectedDepartment
        ) {
            return;
        }

        try {

            setUpdatingDepartment(true);

            const response =
                await updateUserDepartment(
                    departmentUser._id,
                    selectedDepartment
                );

            onDepartmentUpdated(
                departmentUser._id,
                response.user.department
            );

            handleCloseDepartmentDialog();

        } catch (error) {

            console.error(
                "Failed to update user department:",
                error
            );

        } finally {

            setUpdatingDepartment(false);

        }
    };


    return (
        <Box className="user-table-wrapper">

            {/* ================= USER TABLE ================= */}

            <TableContainer className="user-table-container">

                <Table className="user-table">

                    <TableHead>

                        <TableRow className="user-table-header">

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Phone
                            </TableCell>

                            <TableCell>
                                Role
                            </TableCell>

                            <TableCell>
                                Department
                            </TableCell>

                            <TableCell>
                                Created At
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell>
                                Action
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {users.map((user) => (

                            <TableRow
                                key={user._id}
                                className="user-table-row"
                            >

                                {/* NAME */}

                                <TableCell className="user-name">
                                    {user.name}
                                </TableCell>


                                {/* EMAIL */}

                                <TableCell className="user-email">
                                    {user.email}
                                </TableCell>


                                {/* PHONE */}

                                <TableCell
                                    className={
                                        user.phone
                                            ? "user-phone"
                                            : "user-phone user-phone-empty"
                                    }
                                >
                                    {user.phone || "N/A"}
                                </TableCell>


                                {/* ROLE */}

                                <TableCell>

                                    <Chip
                                        label={user.role}
                                        size="small"
                                        className={`role-chip role-${user.role}`}
                                    />

                                </TableCell>


                                {/* DEPARTMENT */}

                                <TableCell>

                                    {user.role ===
                                        "officer" ||
                                        user.role ===
                                        "worker" ? (

                                        user.department?.name ? (

                                            <Chip
                                                label={
                                                    user
                                                        .department
                                                        .name
                                                }
                                                size="small"
                                                className="department-chip"
                                            />

                                        ) : (

                                            <Chip
                                                label="Not Assigned"
                                                size="small"
                                                variant="outlined"
                                                className="not-assigned-chip"
                                            />

                                        )

                                    ) : (

                                        <Typography
                                            component="span"
                                            className="table-na"
                                        >
                                            N/A
                                        </Typography>

                                    )}

                                </TableCell>


                                {/* CREATED AT */}

                                <TableCell className="created-date">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>


                                {/* STATUS */}

                                <TableCell>

                                    <Chip
                                        label={
                                            user.isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        size="small"
                                        className={
                                            user.isActive
                                                ? "status-chip status-active"
                                                : "status-chip status-inactive"
                                        }
                                    />

                                </TableCell>


                                {/* ACTIONS */}

                                <TableCell>

                                    <Box className="user-actions">

                                        {/* CHANGE ROLE */}

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={
                                                user._id ===
                                                currentUserId
                                            }
                                            onClick={() =>
                                                handleOpenRoleDialog(
                                                    user
                                                )
                                            }
                                            className="table-action-button"
                                        >
                                            Change Role
                                        </Button>


                                        {/* DEPARTMENT */}

                                        {(user.role ===
                                            "officer" ||
                                            user.role ===
                                            "worker") && (

                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenDepartmentDialog(
                                                            user
                                                        )
                                                    }
                                                    className="table-action-button"
                                                >
                                                    {user.department
                                                        ? "Change Department"
                                                        : "Assign Department"}
                                                </Button>

                                            )}


                                        {/* STATUS */}

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={
                                                user._id ===
                                                currentUserId
                                            }
                                            onClick={() =>
                                                handleOpenStatusDialog(
                                                    user
                                                )
                                            }
                                            className={
                                                user.isActive
                                                    ? "table-action-button deactivate-button"
                                                    : "table-action-button activate-button"
                                            }
                                        >
                                            {user.isActive
                                                ? "Deactivate"
                                                : "Activate"}
                                        </Button>

                                    </Box>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* ================= ROLE DIALOG ================= */}

            <Dialog
                open={openDialog}
                onClose={handleCloseRoleDialog}
                fullWidth
                maxWidth="xs"
                className="user-dialog"
            >

                <DialogTitle className="user-dialog-title">
                    Change User Role
                </DialogTitle>

                <DialogContent className="user-dialog-content">

                    <Typography className="dialog-description">
                        Select a new role for{" "}
                        <strong>
                            {selectedUser?.name}
                        </strong>
                    </Typography>

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Role
                        </InputLabel>

                        <Select
                            value={selectedRole}
                            label="Role"
                            onChange={(e) =>
                                setSelectedRole(
                                    e.target.value as User["role"]
                                )
                            }
                            className="user-select"
                        >

                            <MenuItem value="citizen">
                                Citizen
                            </MenuItem>

                            <MenuItem value="officer">
                                Officer
                            </MenuItem>

                            <MenuItem value="worker">
                                Worker
                            </MenuItem>

                            <MenuItem value="admin">
                                Admin
                            </MenuItem>

                        </Select>

                    </FormControl>

                </DialogContent>

                <DialogActions className="user-dialog-actions">

                    <Button
                        onClick={handleCloseRoleDialog}
                        disabled={updatingRole}
                        className="dialog-cancel-button"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpdateRole}
                        disabled={
                            updatingRole ||
                            selectedRole ===
                            selectedUser?.role
                        }
                        className="dialog-primary-button"
                    >

                        {updatingRole && (
                            <CircularProgress
                                size={16}
                                className="button-loader"
                            />
                        )}

                        {updatingRole
                            ? "Updating..."
                            : "Update Role"}

                    </Button>

                </DialogActions>

            </Dialog>


            {/* ================= STATUS DIALOG ================= */}

            <Dialog
                open={openStatusDialog}
                onClose={handleCloseStatusDialog}
                fullWidth
                maxWidth="xs"
                className="user-dialog"
            >

                <DialogTitle className="user-dialog-title">
                    {statusUser?.isActive
                        ? "Deactivate User"
                        : "Activate User"}
                </DialogTitle>

                <DialogContent className="user-dialog-content">

                    <DialogContentText className="dialog-description">

                        Are you sure you want to{" "}

                        <strong
                            className={
                                statusUser?.isActive
                                    ? "danger-text"
                                    : "success-text"
                            }
                        >
                            {statusUser?.isActive
                                ? "deactivate"
                                : "activate"}
                        </strong>{" "}

                        {statusUser?.name}?

                    </DialogContentText>

                </DialogContent>

                <DialogActions className="user-dialog-actions">

                    <Button
                        onClick={
                            handleCloseStatusDialog
                        }
                        disabled={updatingStatus}
                        className="dialog-cancel-button"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleUpdateStatus
                        }
                        disabled={
                            updatingStatus
                        }
                        className={
                            statusUser?.isActive
                                ? "dialog-danger-button"
                                : "dialog-success-button"
                        }
                    >

                        {updatingStatus && (
                            <CircularProgress
                                size={16}
                                className="button-loader"
                            />
                        )}

                        {updatingStatus
                            ? "Updating..."
                            : statusUser?.isActive
                                ? "Deactivate"
                                : "Activate"}

                    </Button>

                </DialogActions>

            </Dialog>


            {/* ================= DEPARTMENT DIALOG ================= */}

            <Dialog
                open={openDepartmentDialog}
                onClose={
                    handleCloseDepartmentDialog
                }
                fullWidth
                maxWidth="sm"
                className="user-dialog"
            >

                <DialogTitle className="user-dialog-title">

                    {departmentUser?.department
                        ? "Change Department"
                        : "Assign Department"}

                </DialogTitle>

                <DialogContent className="user-dialog-content">

                    <DialogContentText className="dialog-description">

                        Select the department for{" "}

                        <strong>
                            {departmentUser?.name}
                        </strong>

                    </DialogContentText>

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Department
                        </InputLabel>

                        <Select
                            value={selectedDepartment}
                            label="Department"
                            disabled={
                                loadingDepartments ||
                                updatingDepartment
                            }
                            onChange={(e) =>
                                setSelectedDepartment(
                                    e.target.value
                                )
                            }
                            className="user-select"
                        >

                            {loadingDepartments ? (

                                <MenuItem disabled>

                                    <Box className="department-loading">

                                        <CircularProgress
                                            size={18}
                                        />

                                        <Typography>
                                            Loading departments...
                                        </Typography>

                                    </Box>

                                </MenuItem>

                            ) : (

                                departments.map(
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
                                )

                            )}

                        </Select>

                    </FormControl>

                </DialogContent>

                <DialogActions className="user-dialog-actions">

                    <Button
                        onClick={
                            handleCloseDepartmentDialog
                        }
                        disabled={
                            updatingDepartment
                        }
                        className="dialog-cancel-button"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleUpdateDepartment
                        }
                        disabled={
                            !selectedDepartment ||
                            updatingDepartment
                        }
                        className="dialog-primary-button"
                    >

                        {updatingDepartment && (
                            <CircularProgress
                                size={16}
                                className="button-loader"
                            />
                        )}

                        {updatingDepartment
                            ? "Saving..."
                            : "Save Department"}

                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};

export default UserTable;