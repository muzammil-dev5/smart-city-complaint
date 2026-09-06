import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Visibility,
    VisibilityOff,
    ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../services/authService";
import { login } from "../../store/authSlice";
import "./Auth.scss";

interface LoginFormData {
    email: string;
    password: string;
}

const loginSchema = yup.object({
    email: yup
        .string()
        .trim()
        .email("Please enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .required("Password is required"),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const getErrorMessage = (error: any) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Something went wrong. Please try again."
        );
    };

    const onSubmit = async (data: LoginFormData) => {
        setServerError("");
        setLoading(true);

        try {
            const response = await loginUser(data);

            if (!response?.token || !response?.user) {
                throw new Error("Invalid server response. Please try again.");
            }

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            dispatch(
                login({
                    token: response.token,
                    user: response.user,
                })
            );

            const role = response.user.role;

            switch (role) {
                case "citizen":
                    navigate("/citizen/dashboard");
                    break;

                case "admin":
                    navigate("/admin/dashboard");
                    break;

                case "worker":
                    navigate("/worker/dashboard");
                    break;

                case "officer":
                    navigate("/officer/dashboard");
                    break;

                default:
                    setServerError(
                        "Your account role is not configured correctly."
                    );
                    break;
            }
        } catch (error: any) {
            setServerError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page login-page">
            {/* FORM */}
            <Box className="auth-form-section">
                <Box className="auth-form-container">
                    {/* MOBILE BRAND */}
                    <Box className="mobile-brand">
                        <Box className="brand-icon">
                            <Typography>🏙️</Typography>
                        </Box>

                        <Typography className="mobile-brand-name">
                            Smart City
                        </Typography>
                    </Box>

                    <Box className="auth-heading">
                        <Typography className="auth-eyebrow">
                            WELCOME BACK
                        </Typography>

                        <Typography className="auth-title">
                            Sign in to your account
                        </Typography>

                        <Typography className="auth-description">
                            Access your dashboard and manage your city
                            complaints.
                        </Typography>
                    </Box>

                    {serverError && (
                        <Alert
                            severity="error"
                            className="auth-error-alert"
                            onClose={() => setServerError("")}
                        >
                            {serverError}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        {/* EMAIL */}
                        <Box className="field-group">
                            <Typography className="field-label">
                                Email Address
                            </Typography>

                            <TextField
                                fullWidth
                                className="auth-input"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={loading}
                            />
                        </Box>

                        {/* PASSWORD */}
                        <Box className="field-group">
                            <Box className="password-label-row">
                                <Typography className="field-label">
                                    Password
                                </Typography>

                                <Typography
                                    className="forgot-password"
                                    onClick={() => {
                                        // Add forgot password route here later
                                    }}
                                >
                                    Forgot password?
                                </Typography>
                            </Box>

                            <TextField
                                fullWidth
                                className="auth-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={loading}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    edge="end"
                                                    aria-label={
                                                        showPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>

                        <Button
                            fullWidth
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                            endIcon={
                                !loading ? <ArrowForward /> : undefined
                            }
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </Box>

                    <Typography className="auth-switch">
                        Don't have an account?
                        <span onClick={() => navigate("/register")}>
                            Create account
                        </span>
                    </Typography>

                    <Typography className="auth-footer">
                        © {new Date().getFullYear()} Smart City Complaint
                        Management System
                    </Typography>
                </Box>
            </Box>

            {/* RIGHT VISUAL */}
            <Box className="auth-visual-section">
                <Box className="visual-overlay" />

                <Box className="visual-content">
                    <Box className="visual-brand">
                        <Box className="brand-icon">
                            <Typography>🏙️</Typography>
                        </Box>

                        <Box>
                            <Typography className="visual-brand-title">
                                Smart City
                            </Typography>

                            <Typography className="visual-brand-subtitle">
                                Complaint Management
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="visual-message">
                        <Typography className="visual-small-title">
                            YOUR CITY. YOUR VOICE.
                        </Typography>

                        <Typography className="visual-title">
                            Together, we make <span>Karachi</span> better.
                        </Typography>

                        <Typography className="visual-description">
                            Report problems, follow their progress and play
                            your part in building a smarter city.
                        </Typography>
                    </Box>

                    <Box className="visual-bottom">
                        <Box className="visual-line" />
                        <Typography>
                            Your voice can make a difference.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;