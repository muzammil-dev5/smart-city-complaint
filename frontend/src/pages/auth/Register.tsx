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
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Auth.scss";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

const registerSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),

    email: yup
        .string()
        .trim()
        .email("Please enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must not exceed 50 characters"),
});

const Register = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
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

    const onSubmit = async (data: RegisterFormData) => {
        setServerError("");
        setLoading(true);

        try {
            const response = await registerUser(data);

            if (response?.token) {
                localStorage.setItem("token", response.token);
            }

            navigate("/login");
        } catch (error: any) {
            setServerError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page register-page">
            {/* LEFT VISUAL */}
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
                            Build a <span>better</span> Karachi.
                        </Typography>

                        <Typography className="visual-description">
                            Report city issues, track complaints and help
                            create a cleaner, safer and smarter community.
                        </Typography>
                    </Box>

                    <Box className="visual-bottom">
                        <Box className="visual-line" />
                        <Typography>
                            Together we make our city better.
                        </Typography>
                    </Box>
                </Box>
            </Box>

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
                            GET STARTED
                        </Typography>

                        <Typography className="auth-title">
                            Create your account
                        </Typography>

                        <Typography className="auth-description">
                            Join the Smart City community and help improve
                            your city.
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
                        {/* NAME */}
                        <Box className="field-group">
                            <Typography className="field-label">
                                Full Name
                            </Typography>

                            <TextField
                                fullWidth
                                className="auth-input"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={loading}
                            />
                        </Box>

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
                            <Typography className="field-label">
                                Password
                            </Typography>

                            <TextField
                                fullWidth
                                className="auth-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                autoComplete="new-password"
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
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </Box>

                    <Typography className="auth-switch">
                        Already have an account?
                        <span onClick={() => navigate("/login")}>
                            Sign in
                        </span>
                    </Typography>

                    <Typography className="auth-footer">
                        © {new Date().getFullYear()} Smart City Complaint
                        Management System
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;