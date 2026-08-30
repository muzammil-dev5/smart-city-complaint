import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "./Auth.scss";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

const schema = yup.object({
    name: yup
        .string()
        .required("Name is required"),

    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Register = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setLoading(true);

            const response = await registerUser(data);

            localStorage.setItem("token", response.token);

            navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page register-page">

            {/* LEFT - VISUAL */}
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
                            YOUR CITY. YOUR VOICE.
                        </Typography>

                        <Typography className="visual-title">
                            Be part of
                            <br />
                            a <span>better</span>
                            <br />
                            Karachi.
                        </Typography>

                        <Typography className="visual-description">
                            Join your community and help authorities
                            identify, manage and resolve everyday
                            problems around the city.
                        </Typography>
                    </Box>

                    <Box className="visual-bottom">
                        <Box className="visual-line" />

                        <Typography>
                            Every report can make a difference.
                        </Typography>
                    </Box>

                </Box>

            </Box>

            {/* RIGHT - REGISTER FORM */}
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
                            GET STARTED
                        </Typography>

                        <Typography className="auth-title">
                            Create your account
                        </Typography>

                        <Typography className="auth-description">
                            Create an account and become part of
                            building a better city.
                        </Typography>
                    </Box>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <Box className="field-group">
                            <Typography className="field-label">
                                Full Name
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="Enter your full name"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                className="auth-input"
                            />
                        </Box>

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
                            <Typography className="field-label">
                                Password
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="Create a password"
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
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </Button>

                    </form>

                    <Typography className="auth-switch">
                        Already have an account?
                        <Box
                            component="span"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </Box>
                    </Typography>

                    <Typography className="auth-footer">
                        © 2026 Smart City Complaint Management
                    </Typography>

                </Box>
            </Box>

        </Box>
    );
};

export default Register;