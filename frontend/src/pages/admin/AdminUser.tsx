import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { getAllUsers } from "../../services/userService";
import UserTable from "../../components/Table/UserTable";
import type { User, RoleFilter } from "../../types/user";

import "./AdminUser.scss";

const AdminUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] =
        useState<RoleFilter>("all");

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser
        ? JSON.parse(storedUser)
        : null;

    // ================= FETCH USERS =================

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await getAllUsers();

                setUsers(response.users || []);
            } catch (error) {
                console.error(
                    "Failed to fetch users:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // ================= FILTER USERS =================

    const filteredUsers = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(searchValue) ||
                user.email
                    .toLowerCase()
                    .includes(searchValue) ||
                (user.phone || "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    // ================= ROLE UPDATE =================

    const handleRoleUpdated = (
        userId: string,
        role: User["role"]
    ) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user._id === userId
                    ? {
                        ...user,
                        role,
                        department:
                            role === "citizen" ||
                                role === "admin"
                                ? null
                                : user.department,
                    }
                    : user
            )
        );
    };

    // ================= DEPARTMENT UPDATE =================

    const handleDepartmentUpdated = (
        userId: string,
        department: User["department"]
    ) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user._id === userId
                    ? {
                        ...user,
                        department,
                    }
                    : user
            )
        );
    };

    // ================= STATUS UPDATE =================

    const handleStatusUpdated = (
        userId: string,
        isActive: boolean
    ) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user._id === userId
                    ? {
                        ...user,
                        isActive,
                    }
                    : user
            )
        );
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <Box className="adminUser-loading">
                <CircularProgress />

                <Typography>
                    Loading users...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="adminUser-page">

            {/* ================= HEADER ================= */}

            <Box className="adminUser-header">

                <Box>
                    <Typography className="adminUser-heading">
                        User Management
                    </Typography>

                    <Typography className="adminUser-subtitle">
                        Manage users, roles, departments and
                        account access.
                    </Typography>
                </Box>

                <Box className="adminUser-count">

                    <Typography className="count-number">
                        {users.length}
                    </Typography>

                    <Typography className="count-label">
                        Total Users
                    </Typography>

                </Box>

            </Box>

            {/* ================= FILTERS ================= */}

            <Box className="adminUser-filters">

                <TextField
                    className="adminUser-search"
                    value={search}
                    label="Search Users"
                    placeholder="Search by name, email or phone..."
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <FormControl className="adminUser-roleFilter">

                    <InputLabel id="admin-user-role-filter">
                        Role
                    </InputLabel>

                    <Select
                        labelId="admin-user-role-filter"
                        value={roleFilter}
                        label="Role"
                        onChange={(event) =>
                            setRoleFilter(
                                event.target.value as RoleFilter
                            )
                        }
                    >
                        <MenuItem value="all">
                            All Roles
                        </MenuItem>

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

            </Box>

            {/* ================= USER TABLE ================= */}

            <Box className="adminUser-table">

                <Box className="adminUser-tableHeader">

                    <Box>
                        <Typography className="table-title">
                            All Users
                        </Typography>

                        <Typography className="table-subtitle">
                            {filteredUsers.length} users found
                        </Typography>
                    </Box>

                </Box>

                <UserTable
                    users={filteredUsers}
                    onRoleUpdated={handleRoleUpdated}
                    onStatusUpdated={handleStatusUpdated}
                    onDepartmentUpdated={
                        handleDepartmentUpdated
                    }
                    currentUserId={
                        currentUser?._id ??
                        currentUser?.id
                    }
                />

            </Box>

        </Box>
    );
};

export default AdminUser;