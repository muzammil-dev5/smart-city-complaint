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
    LocationOnOutlined,
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

    // =========================
    // STATE
    // =========================

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] =
        useState<"success" | "error">("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // =========================
    // HELPERS
    // =========================

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
        setAddress(user.address ?? "");
    };

    // =========================
    // FETCH PROFILE
    // =========================

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

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            try {
                const response = await getMyProfile();

                if (cancelled) {
                    return;
                }

                populateProfile(response.user);
            } catch (error) {
                if (cancelled) {
                    return;
                }

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

    // =========================
    // EDIT PROFILE
    // =========================

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setName(profile?.name ?? "");
        setPhone(profile?.phone ?? "");
        setAddress(profile?.address ?? "");

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
                address: address.trim(),
            });

            const updatedUser = response.user;

            populateProfile(updatedUser);

            // Update localStorage so Navbar
            // immediately shows the updated user information.
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

    // =========================
    // CHANGE PASSWORD
    // =========================

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

    // =========================
    // HELPERS
    // =========================

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

    // =========================
    // LOADING STATE
    // =========================

    if (loading) {
        return (
            <Box className="profile-loading">
                <CircularProgress />

                <Typography>
                    Loading profile...
                </Typography>
            </Box>
        );
    }

    // =========================
    // ERROR STATE
    // =========================

    if (!profile) {
        return (
            <Box className="profile-error">
                <Typography variant="h6">
                    Unable to load profile.
                </Typography>

                <Button
                    variant="contained"
                    onClick={fetchProfile}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    // =========================
    // PROFILE PAGE
    // =========================

    return (
        <Box className="profile-page">

            {/* ================= HEADER ================= */}

            <Box className="profile-header">
                <Box className="profile-header-left">

                    <IconButton
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackOutlined />
                    </IconButton>

                    <Box>
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

            {/* ================= PROFILE CARD ================= */}

            <Paper
                elevation={0}
                className="profile-card"
            >
                <Box className="profile-card-top">

                    <Box className="profile-avatar-wrapper">
                        <Avatar className="profile-avatar">
                            {getInitial()}
                        </Avatar>
                    </Box>

                    <Box className="profile-user-info">

                        <Typography className="profile-name">
                            {profile.name}
                        </Typography>

                        <Typography className="profile-email">
                            {profile.email}
                        </Typography>

                        <Box className="profile-role">
                            {formatRole(profile.role)}
                        </Box>

                    </Box>

                </Box>

                <Divider />

                {/* ================= PERSONAL INFORMATION ================= */}

                <Box className="profile-section">

                    <Box className="section-header">

                        <Box className="section-title-wrapper">

                            <Box className="section-icon">
                                <PersonOutlined />
                            </Box>

                            <Box>
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
                            >
                                Edit Profile
                            </Button>
                        )}

                    </Box>

                    <Box className="profile-fields">

                        {/* Name */}

                        <Box className="profile-field">

                            <Typography className="field-label">
                                Full Name
                            </Typography>

                            {editMode ? (
                                <TextField
                                    fullWidth
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your name"
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
                                        setPhone(event.target.value)
                                    }
                                    placeholder="Enter phone number"
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

                        {/* Address */}

                        <Box className="profile-field profile-field-full">

                            <Typography className="field-label">
                                Address
                            </Typography>

                            {editMode ? (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    placeholder="Enter your address"
                                />
                            ) : (
                                <Box className="field-with-icon">

                                    <LocationOnOutlined />

                                    <Typography className="field-value">
                                        {profile.address ||
                                            "Not provided"}
                                    </Typography>

                                </Box>
                            )}

                        </Box>

                    </Box>

                    {/* Edit Actions */}

                    {editMode && (
                        <Box className="edit-actions">

                            <Button
                                variant="outlined"
                                startIcon={<CloseOutlined />}
                                onClick={handleCancelEdit}
                                disabled={saving}
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
                                onClick={handleSaveProfile}
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                        </Box>
                    )}

                </Box>
            </Paper>

            {/* ================= SECURITY CARD ================= */}

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

                            <Box>
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
                                startIcon={<LockOutlined />}
                                onClick={() =>
                                    setShowPasswordSection(true)
                                }
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

                            <TextField
                                fullWidth
                                type="password"
                                label="Current Password"
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                            />

                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                            />

                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                            />

                            <Box className="password-actions">

                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setShowPasswordSection(false);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    disabled={changingPassword}
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
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
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

            {/* ================= ACCOUNT INFO ================= */}

            <Paper
                elevation={0}
                className="profile-card account-card"
            >
                <Box className="profile-section">

                    <Typography className="section-title">
                        Account Information
                    </Typography>

                    <Stack
                        spacing={2}
                        className="account-info"
                    >

                        <Box className="account-row">

                            <Typography>
                                Account Role
                            </Typography>

                            <Typography className="account-value">
                                {formatRole(profile.role)}
                            </Typography>

                        </Box>

                        {profile.createdAt && (
                            <Box className="account-row">

                                <Typography>
                                    Member Since
                                </Typography>

                                <Typography className="account-value">
                                    {new Date(
                                        profile.createdAt
                                    ).toLocaleDateString()}
                                </Typography>

                            </Box>
                        )}

                    </Stack>

                </Box>
            </Paper>

            {/* ================= SNACKBAR ================= */}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity={messageType}
                    onClose={() => setSnackbarOpen(false)}
                    variant="filled"
                >
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default Profile;
