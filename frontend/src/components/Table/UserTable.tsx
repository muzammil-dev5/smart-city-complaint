import {
    TableContainer, Table, TableRow, TableHead, TableCell, TableBody, Chip, Button,
    Dialog, DialogTitle, DialogContent, InputLabel, Select, MenuItem, FormControl, DialogContentText,
    DialogActions
} from '@mui/material';
import type { User } from "../../types/user";
import { useState } from 'react';
import { updateUserRole, updateUserStatus } from "../../services/userService";

type UserTableProps = {
    users: User[];
    onRoleUpdated: (userId: string, role: User["role"]) => void;
    onStatusUpdated: (userId: string, isActive: boolean) => void;
    currentUserId: string;
};

const UserTable = ({ users, onRoleUpdated, onStatusUpdated, currentUserId }: UserTableProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [statusUser, setStatusUser] = useState<User | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updatingRole, setUpdatingRole] = useState(false);

    // dialog open method
    const handleOpenDialog = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setOpenDialog(true);
    };

    const handleOpenStatusDialog = (user: User) => {
        console.log("STATUS BUTTON CLICKED:", user);

        setStatusUser(user);
        setOpenStatusDialog(true);

        console.log("Dialog should open");
    };

    // dialog close method
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false);
        setStatusUser(null);
    };

    //Role Update method
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
                selectedRole as User["role"]
            );

            handleCloseDialog();

        } catch (error) {
            console.error(
                "Failed to update user role:",
                error
            );
        } finally {
            setUpdatingRole(false);
        }
    };

    // update Status method
    const handleUpdateStatus = async () => {
        if (!statusUser) return;

        const newStatus = !statusUser.isActive;

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
            console.error("Failed to update user status:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone || "N/A"}</TableCell>
                                <TableCell><Chip label={user.role} size='small' /></TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell><Chip label={user.isActive ? "Active" : "Inactive"} color={user.isActive ? "success" : "default"} size="small" /> </TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => handleOpenDialog(user)}>Change Role</Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={user.isActive ? "error" : "success"}
                                        sx={{ ml: 1 }}
                                        disabled={user._id === currentUserId}
                                        onClick={() => handleOpenStatusDialog(user)}
                                    >
                                        {user.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Change User Role</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Role</InputLabel>
                        <Select value={selectedRole} label="Role" onChange={(e) => setSelectedRole(e.target.value)}>
                            <MenuItem value="citizen">Citizen</MenuItem>
                            <MenuItem value="officer">Officer</MenuItem>
                            <MenuItem value="worker">Worker</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent >
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={updatingRole}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateRole}
                        disabled={updatingRole}
                    >
                        {updatingRole ? "Updating..." : "Update Role"}
                    </Button>

                </DialogActions>
            </Dialog >


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
                        onClick={handleCloseStatusDialog}
                        disabled={updatingStatus}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color={statusUser?.isActive ? "error" : "success"}
                        onClick={handleUpdateStatus}
                        disabled={updatingStatus}>
                        {updatingStatus ? "Updating..." : statusUser?.isActive ? "Deactivate" : "Activate"}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default UserTable
