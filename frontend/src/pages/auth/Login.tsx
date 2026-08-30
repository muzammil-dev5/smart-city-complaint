import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "./Auth.scss";

interface LoginFormData {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email")
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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);
            const response = await loginUser(data);
            dispatch(
                login({
                    user: response.user,
                    token: response.token,
                })
            );

            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            const role = response.user.role;

            if (role === "citizen") {
                navigate("/citizen/dashboard");
            } else if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "worker") {
                navigate("/worker/dashboard");
            } else if (role === "officer") {
                navigate("/officer/dashboard");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page login-page">

            {/* LEFT - LOGIN FORM */}
            <Box className="auth-form-section">

                <Box className="auth-form-container">

                    <Box className="mobile-brand">
                        <Box className="brand-icon">
                            <LocationCityOutlinedIcon />
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
                            Welcome back!
                        </Typography>

                        <Typography className="auth-description">
                            Sign in to continue managing and tracking
                            your city complaints.
                        </Typography>
                    </Box>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <Box className="field-group">
                            <Typography className="field-label">
                                Email Address
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="Enter your email"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                className="auth-input"
                            />
                        </Box>

                        <Box className="field-group">
                            <Box className="password-label-row">
                                <Typography className="field-label">
                                    Password
                                </Typography>

                                <Typography className="forgot-password">
                                    Forgot password?
                                </Typography>
                            </Box>

                            <TextField
                                fullWidth
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                className="auth-input"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    edge="end"
                                                    className="password-toggle"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffOutlinedIcon />
                                                    ) : (
                                                        <VisibilityOutlinedIcon />
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
                            disabled={loading}
                            className="auth-submit"
                            endIcon={
                                !loading && (
                                    <ArrowForwardRoundedIcon />
                                )
                            }
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                    </form>

                    <Typography className="auth-switch">
                        Don't have an account?
                        <Box
                            component="span"
                            onClick={() => navigate("/register")}
                        >
                            Create an account
                        </Box>
                    </Typography>

                    <Typography className="auth-footer">
                        © 2026 Smart City Complaint Management
                    </Typography>

                </Box>
            </Box>

            {/* RIGHT - VISUAL */}
            <Box className="auth-visual-section">

                <Box className="visual-overlay" />

                <Box className="visual-content">

                    <Box className="visual-brand">
                        <Box className="brand-icon">
                            <LocationCityOutlinedIcon />
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
                            SMARTER CITY. BETTER LIVING.
                        </Typography>

                        <Typography className="visual-title">
                            Connect.
                            <br />
                            Report.
                            <br />
                            <span>Improve.</span>
                        </Typography>

                        <Typography className="visual-description">
                            Help make Karachi a cleaner, safer and
                            better-connected city by reporting issues
                            in your area.
                        </Typography>
                    </Box>

                    <Box className="visual-bottom">
                        <Box className="visual-line" />

                        <Typography>
                            Together we can build a better city.
                        </Typography>
                    </Box>

                </Box>

            </Box>
        </Box>
    );
};

export default Login;