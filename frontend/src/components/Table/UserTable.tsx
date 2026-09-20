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
} from "@mui/material";

import type { User, Department } from "../../types/user";

import { useEffect, useState } from "react";

import {
    updateUserRole,
    updateUserStatus,
    updateUserDepartment,
} from "../../services/userService";

import { getActiveDepartments } from "../../services/departmentService";

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

    const [openDialog, setOpenDialog] = useState(false);

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


    // Load active departments when dialog opens
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
        <>

            {/* ================= USER TABLE ================= */}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>

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
                            >

                                <TableCell>
                                    {user.name}
                                </TableCell>

                                <TableCell>
                                    {user.email}
                                </TableCell>

                                <TableCell>
                                    {user.phone || "N/A"}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell>

                                    {user.role === "officer" ||
                                    user.role === "worker" ? (

                                        user.department?.name ? (

                                            <Chip
                                                label={
                                                    user.department.name
                                                }
                                                size="small"
                                                color="primary"
                                            />

                                        ) : (

                                            <Chip
                                                label="Not Assigned"
                                                size="small"
                                                variant="outlined"
                                            />

                                        )

                                    ) : (
                                        "N/A"
                                    )}

                                </TableCell>

                                <TableCell>
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            user.isActive
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        color={
                                            user.isActive
                                                ? "success"
                                                : "default"
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    {/* Change Role */}

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
                                    >
                                        Change Role
                                    </Button>


                                    {/* Department */}

                                    {(user.role === "officer" ||
                                        user.role === "worker") && (

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                ml: 1,
                                            }}
                                            onClick={() =>
                                                handleOpenDepartmentDialog(
                                                    user
                                                )
                                            }
                                        >
                                            {user.department
                                                ? "Change Department"
                                                : "Assign Department"}
                                        </Button>

                                    )}


                                    {/* Status */}

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={
                                            user.isActive
                                                ? "error"
                                                : "success"
                                        }
                                        sx={{
                                            ml: 1,
                                        }}
                                        disabled={
                                            user._id ===
                                            currentUserId
                                        }
                                        onClick={() =>
                                            handleOpenStatusDialog(
                                                user
                                            )
                                        }
                                    >
                                        {user.isActive
                                            ? "Deactivate"
                                            : "Activate"}
                                    </Button>

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
            >

                <DialogTitle>
                    Change User Role
                </DialogTitle>

                <DialogContent>

                    <FormControl
                        fullWidth
                        sx={{ mt: 1 }}
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

                <DialogActions>

                    <Button
                        onClick={handleCloseRoleDialog}
                        disabled={updatingRole}
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
                    >
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
            >

                <DialogTitle>
                    {statusUser?.isActive
                        ? "Deactivate User"
                        : "Activate User"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>

                        Are you sure you want to{" "}
                        {statusUser?.isActive
                            ? "deactivate"
                            : "activate"}{" "}
                        {statusUser?.name}?

                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={
                            handleCloseStatusDialog
                        }
                        disabled={updatingStatus}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color={
                            statusUser?.isActive
                                ? "error"
                                : "success"
                        }
                        onClick={
                            handleUpdateStatus
                        }
                        disabled={
                            updatingStatus
                        }
                    >
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
            >

                <DialogTitle>
                    {departmentUser?.department
                        ? "Change Department"
                        : "Assign Department"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText
                        sx={{ mb: 2 }}
                    >
                        User:{" "}
                        <strong>
                            {departmentUser?.name}
                        </strong>
                    </DialogContentText>

                    <FormControl
                        fullWidth
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
                        >

                            {loadingDepartments ? (

                                <MenuItem disabled>
                                    <CircularProgress
                                        size={20}
                                    />
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

                <DialogActions>

                    <Button
                        onClick={
                            handleCloseDepartmentDialog
                        }
                        disabled={
                            updatingDepartment
                        }
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
                    >
                        {updatingDepartment
                            ? "Updating..."
                            : "Save Department"}
                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
};

export default UserTable;