
import {
    Box,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleOutlineIcon from "@mui/icons-material/PeopleAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
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
                <Box className="adminUser-loadingIcon">
                    <CircularProgress size={28} />
                </Box>

                <Typography className="adminUser-loadingTitle">
                    Loading users
                </Typography>

                <Typography className="adminUser-loadingText">
                    Please wait while we load user information.
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="adminUser-page">

            {/* ================= PAGE HEADER ================= */}

            <Box className="adminUser-header">

                <Box className="adminUser-headerContent">

                    <Box className="adminUser-titleRow">
                        <Box className="adminUser-titleIcon">
                            <PeopleOutlineIcon fontSize="small" />
                        </Box>

                        <Typography className="adminUser-heading">
                            User Management
                        </Typography>
                    </Box>

                    <Typography className="adminUser-subtitle">
                        Manage users, roles, departments and
                        account access from one place.
                    </Typography>

                </Box>

                {/* ================= USER STAT ================= */}

                <Box className="adminUser-count">

                    <Box className="adminUser-countIcon">
                        <PeopleOutlineIcon fontSize="small" />
                    </Box>

                    <Box>
                        <Typography className="count-number">
                            {users.length}
                        </Typography>

                        <Typography className="count-label">
                            Total Users
                        </Typography>
                    </Box>

                </Box>

            </Box>

            {/* ================= FILTER CARD ================= */}

            <Box className="adminUser-filterCard">

                <Box className="adminUser-filterHeader">

                    <Box className="adminUser-filterTitleRow">

                        <Box className="adminUser-filterIcon">
                            <SearchIcon fontSize="small" />
                        </Box>

                        <Box>
                            <Typography className="filter-title">
                                Search & Filter
                            </Typography>

                            <Typography className="filter-subtitle">
                                Find users quickly using name, email,
                                phone or role.
                            </Typography>
                        </Box>

                    </Box>

                    {(search || roleFilter !== "all") && (
                        <Typography className="filter-active">
                            Filters applied
                        </Typography>
                    )}

                </Box>

                <Box className="adminUser-filters">

                    <TextField
                        className="adminUser-search"
                        value={search}
                        label="Search Users"
                        placeholder="Name, email or phone..."
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
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

            </Box>

            {/* ================= USERS TABLE ================= */}

            <Box className="adminUser-table">

                <Box className="adminUser-tableHeader">

                    <Box className="adminUser-tableTitleWrapper">

                        <Box className="adminUser-tableIcon">
                            <AdminPanelSettingsOutlinedIcon fontSize="small" />
                        </Box>

                        <Box>
                            <Typography className="table-title">
                                User Accounts
                            </Typography>

                            <Typography className="table-subtitle">
                                Showing{" "}
                                <strong>
                                    {filteredUsers.length}
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {users.length}
                                </strong>{" "}
                                users
                            </Typography>
                        </Box>

                    </Box>

                    <Box className="adminUser-resultBadge">
                        {filteredUsers.length} Results
                    </Box>

                </Box>

                <Box className="adminUser-tableContent">

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

        </Box>
    );
};

export default AdminUser;