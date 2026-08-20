import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import { useEffect, useState } from "react";

import {
    createDepartment,
    getAllDepartments,
    updateDepartment
} from "../../services/departmentService";

import type { Department } from "../../types/user";


const AdminDepartments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");


    // Reusable function for refreshing departments
    const loadDepartments = async () => {
        try {
            const response = await getAllDepartments();

            setDepartments(response.departments);
        } catch (error) {
            console.error(
                "Failed to fetch departments:",
                error
            );
        }
    };


    // Initial page load
    useEffect(() => {
        const fetchInitialDepartments = async () => {
            try {
                const response = await getAllDepartments();

                setDepartments(response.departments);
            } catch (error) {
                console.error(
                    "Failed to fetch departments:",
                    error
                );
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
            console.error(
                "Failed to create department:",
                error
            );
        }
    };


    const handleToggleStatus = async (
        department: Department
    ) => {
        try {
            await updateDepartment(
                department._id,
                {
                    isActive: !department.isActive
                }
            );

            await loadDepartments();

        } catch (error) {
            console.error(
                "Failed to update department status:",
                error
            );
        }
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setName("");
        setDescription("");
    };


    if (loading) {
        return (
            <Typography>
                Loading departments...
            </Typography>
        );
    }


    return (
        <Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Typography variant="h4">
                    Department Management
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                >
                    Add Department
                </Button>
            </Box>


            <TableContainer component={Paper}>
                <Table>

                    <TableHead>
                        <TableRow>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Description
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

                        {departments.length === 0 ? (

                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    align="center"
                                >
                                    No departments found.
                                </TableCell>
                            </TableRow>

                        ) : (

                            departments.map((department) => (
                                <TableRow
                                    key={department._id}
                                >

                                    <TableCell>
                                        {department.name}
                                    </TableCell>

                                    <TableCell>
                                        {department.description || "N/A"}
                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={
                                                department.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            color={
                                                department.isActive
                                                    ? "success"
                                                    : "default"
                                            }
                                            size="small"
                                        />

                                    </TableCell>


                                    <TableCell>

                                        <Button
                                            variant="outlined"
                                            color={
                                                department.isActive
                                                    ? "error"
                                                    : "success"
                                            }
                                            size="small"
                                            onClick={() =>
                                                handleToggleStatus(
                                                    department
                                                )
                                            }
                                        >
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


            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Add Department
                </DialogTitle>


                <DialogContent>

                    <TextField
                        fullWidth
                        label="Department Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        sx={{
                            mt: 1,
                            mb: 2
                        }}
                    />


                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={handleCloseDialog}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        disabled={!name.trim()}
                        onClick={handleCreateDepartment}
                    >
                        Add Department
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
};


export default AdminDepartments;
