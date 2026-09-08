import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBackOutlined,
    EditOutlined,
    LockOutlined,
    PersonOutlined,
    SaveOutlined,
    CloseOutlined,
    EmailOutlined,
    PhoneOutlined,
    ShieldOutlined,
    CalendarTodayOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    changeMyPassword,
    getMyProfile,
    updateMyProfile,
} from "../../services/profileService";

import type { UserProfile } from "../../services/profileService";

import "./Profile.scss";

const Profile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] =
        useState<"success" | "error">("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const showMessage = (
        text: string,
        type: "success" | "error"
    ) => {
        setMessage(text);
        setMessageType(type);
        setSnackbarOpen(true);
    };

    const populateProfile = (user: UserProfile) => {
        setProfile(user);
        setName(user.name ?? "");
        setPhone(user.phone ?? "");
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);

            const response = await getMyProfile();

            populateProfile(response.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);

            showMessage(
                "Failed to load profile.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            try {
                const response = await getMyProfile();

                if (cancelled) return;

                populateProfile(response.user);
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Failed to fetch profile:",
                    error
                );

                showMessage(
                    "Failed to load profile.",
                    "error"
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setName(profile?.name ?? "");
        setPhone(profile?.phone ?? "");
        setEditMode(false);
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            showMessage(
                "Name is required.",
                "error"
            );

            return;
        }

        try {
            setSaving(true);

            const response = await updateMyProfile({
                name: name.trim(),
                phone: phone.trim(),
            });

            const updatedUser = response.user;

            populateProfile(updatedUser);

            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                const localUser = JSON.parse(storedUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...localUser,
                        ...updatedUser,
                    })
                );
            }

            setEditMode(false);

            showMessage(
                "Profile updated successfully.",
                "success"
            );
        } catch (error) {
            console.error(
                "Update profile error:",
                error
            );

            showMessage(
                "Failed to update profile.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            showMessage(
                "Please enter your current password.",
                "error"
            );

            return;
        }

        if (!newPassword) {
            showMessage(
                "Please enter a new password.",
                "error"
            );

            return;
        }

        if (newPassword.length < 6) {
            showMessage(
                "New password must be at least 6 characters.",
                "error"
            );

            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage(
                "New password and confirm password do not match.",
                "error"
            );

            return;
        }

        try {
            setChangingPassword(true);

            await changeMyPassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowPasswordSection(false);

            showMessage(
                "Password changed successfully.",
                "success"
            );
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            showMessage(
                "Failed to change password. Please check your current password.",
                "error"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    const getInitial = () => {
        return (
            profile?.name
                ?.charAt(0)
                .toUpperCase() || "U"
        );
    };

    const formatRole = (role?: string) => {
        if (!role) {
            return "User";
        }

        return (
            role.charAt(0).toUpperCase() +
            role.slice(1)
        );
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Box className="profile-loading">
                <Box className="loading-content">
                    <CircularProgress
                        size={38}
                        thickness={4}
                    />

                    <Typography className="loading-title">
                        Loading profile
                    </Typography>

                    <Typography className="loading-text">
                        Please wait while we load your information...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box className="profile-error">
                <Box className="error-content">
                    <Box className="error-icon">
                        <PersonOutlined />
                    </Box>

                    <Typography className="error-title">
                        Unable to load profile
                    </Typography>

                    <Typography className="error-description">
                        Something went wrong while loading
                        your profile information.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={fetchProfile}
                        className="primary-button"
                    >
                        Try Again
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="profile-page">

            {/* ================= PAGE HEADER ================= */}

            <Box className="profile-header">
                <Box className="header-content">

                    <IconButton
                        className="back-button"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowBackOutlined />
                    </IconButton>

                    <Box className="header-text">
                        <Typography className="profile-title">
                            My Profile
                        </Typography>

                        <Typography className="profile-subtitle">
                            Manage your personal information
                            and account settings
                        </Typography>
                    </Box>

                </Box>
            </Box>

            {/* ================= MAIN CONTENT ================= */}

            <Box className="profile-content">

                {/* ================= USER OVERVIEW ================= */}

                <Paper
                    elevation={0}
                    className="profile-card overview-card"
                >
                    <Box className="overview-content">

                        <Avatar className="profile-avatar">
                            {getInitial()}
                        </Avatar>

                        <Box className="profile-user-info">

                            <Typography className="profile-name">
                                {profile.name}
                            </Typography>

                            <Box className="email-row">
                                <EmailOutlined />

                                <Typography className="profile-email">
                                    {profile.email}
                                </Typography>
                            </Box>

                            <Box className="role-badge">
                                <ShieldOutlined />

                                <Typography>
                                    {formatRole(profile.role)}
                                </Typography>
                            </Box>

                        </Box>

                    </Box>
                </Paper>

                {/* ================= PERSONAL INFORMATION ================= */}

                <Paper
                    elevation={0}
                    className="profile-card"
                >
                    <Box className="profile-section">

                        <Box className="section-header">

                            <Box className="section-title-wrapper">

                                <Box className="section-icon">
                                    <PersonOutlined />
                                </Box>

                                <Box className="section-heading">
                                    <Typography className="section-title">
                                        Personal Information
                                    </Typography>

                                    <Typography className="section-description">
                                        Update your personal details
                                    </Typography>
                                </Box>

                            </Box>

                            {!editMode && (
                                <Button
                                    variant="outlined"
                                    startIcon={<EditOutlined />}
                                    onClick={handleEdit}
                                    className="secondary-button"
                                >
                                    Edit Profile
                                </Button>
                            )}

                        </Box>

                        <Divider className="section-divider" />

                        <Box className="profile-fields">

                            {/* Full Name */}

                            <Box className="profile-field">

                                <Typography className="field-label">
                                    Full Name
                                </Typography>

                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your full name"
                                        className="profile-input"
                                    />
                                ) : (
                                    <Typography className="field-value">
                                        {profile.name ||
                                            "Not provided"}
                                    </Typography>
                                )}

                            </Box>

                            {/* Email */}

                            <Box className="profile-field">

                                <Typography className="field-label">
                                    Email Address
                                </Typography>

                                <Box className="field-with-icon">

                                    <EmailOutlined />

                                    <Typography className="field-value">
                                        {profile.email}
                                    </Typography>

                                </Box>

                                <Typography className="field-helper">
                                    Email address cannot be changed.
                                </Typography>

                            </Box>

                            {/* Phone */}

                            <Box className="profile-field">

                                <Typography className="field-label">
                                    Phone Number
                                </Typography>

                                {editMode ? (
                                    <TextField
                                        fullWidth
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter phone number"
                                        className="profile-input"
                                    />
                                ) : (
                                    <Box className="field-with-icon">

                                        <PhoneOutlined />

                                        <Typography className="field-value">
                                            {profile.phone ||
                                                "Not provided"}
                                        </Typography>

                                    </Box>
                                )}

                            </Box>

                        </Box>

                        {editMode && (
                            <Box className="edit-actions">

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <CloseOutlined />
                                    }
                                    onClick={
                                        handleCancelEdit
                                    }
                                    disabled={saving}
                                    className="secondary-button"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={
                                        saving ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        ) : (
                                            <SaveOutlined />
                                        )
                                    }
                                    onClick={
                                        handleSaveProfile
                                    }
                                    disabled={saving}
                                    className="primary-button"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </Button>

                            </Box>
                        )}

                    </Box>
                </Paper>

                {/* ================= SECURITY ================= */}

                <Paper
                    elevation={0}
                    className="profile-card security-card"
                >
                    <Box className="profile-section">

                        <Box className="section-header">

                            <Box className="section-title-wrapper">

                                <Box className="section-icon security-icon">
                                    <LockOutlined />
                                </Box>

                                <Box className="section-heading">
                                    <Typography className="section-title">
                                        Security
                                    </Typography>

                                    <Typography className="section-description">
                                        Manage your account password
                                    </Typography>
                                </Box>

                            </Box>

                            {!showPasswordSection && (
                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <LockOutlined />
                                    }
                                    onClick={() =>
                                        setShowPasswordSection(
                                            true
                                        )
                                    }
                                    className="secondary-button"
                                >
                                    Change Password
                                </Button>
                            )}

                        </Box>

                        {showPasswordSection && (
                            <Box className="password-form">

                                <Alert
                                    severity="info"
                                    className="password-alert"
                                >
                                    Choose a strong password
                                    with at least 6 characters.
                                </Alert>

                                <Box className="password-fields">

                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Current Password"
                                        value={
                                            currentPassword
                                        }
                                        onChange={(event) =>
                                            setCurrentPassword(
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="profile-input"
                                    />

                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="New Password"
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="profile-input"
                                    />

                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirm New Password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target
                                                    .value
                                            )
                                        }
                                        className="profile-input"
                                    />

                                </Box>

                                <Box className="password-actions">

                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setShowPasswordSection(
                                                false
                                            );

                                            setCurrentPassword(
                                                ""
                                            );

                                            setNewPassword(
                                                ""
                                            );

                                            setConfirmPassword(
                                                ""
                                            );
                                        }}
                                        disabled={
                                            changingPassword
                                        }
                                        className="secondary-button"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            changingPassword ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            ) : (
                                                <LockOutlined />
                                            )
                                        }
                                        onClick={
                                            handleChangePassword
                                        }
                                        disabled={
                                            changingPassword
                                        }
                                        className="primary-button"
                                    >
                                        {changingPassword
                                            ? "Changing..."
                                            : "Update Password"}
                                    </Button>

                                </Box>

                            </Box>
                        )}

                    </Box>
                </Paper>

                {/* ================= ACCOUNT INFORMATION ================= */}

                <Paper
                    elevation={0}
                    className="profile-card account-card"
                >
                    <Box className="profile-section">

                        <Box className="account-header">

                            <Box className="section-icon account-icon">
                                <ShieldOutlined />
                            </Box>

                            <Box>
                                <Typography className="section-title">
                                    Account Information
                                </Typography>

                                <Typography className="section-description">
                                    Overview of your account details
                                </Typography>
                            </Box>

                        </Box>

                        <Divider className="section-divider" />

                        <Stack
                            spacing={0}
                            className="account-info"
                        >

                            <Box className="account-row">

                                <Box className="account-label">
                                    <ShieldOutlined />

                                    <Typography>
                                        Account Role
                                    </Typography>
                                </Box>

                                <Typography className="account-value role-value">
                                    {formatRole(profile.role)}
                                </Typography>

                            </Box>

                            {profile.createdAt && (
                                <Box className="account-row">

                                    <Box className="account-label">
                                        <CalendarTodayOutlined />

                                        <Typography>
                                            Member Since
                                        </Typography>
                                    </Box>

                                    <Typography className="account-value">
                                        {new Date(
                                            profile.createdAt
                                        ).toLocaleDateString(
                                            undefined,
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </Typography>

                                </Box>
                            )}

                        </Stack>

                    </Box>
                </Paper>

            </Box>

            {/* ================= SNACKBAR ================= */}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity={messageType}
                    onClose={handleCloseSnackbar}
                    variant="filled"
                    className="profile-snackbar"
                >
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default Profile;