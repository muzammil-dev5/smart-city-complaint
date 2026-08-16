import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

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
        .min(6, "Password must be 6 characters")
        .required("Password is required")
});


const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({ resolver: yupResolver(schema) });

    const navigate = useNavigate();
    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerUser(data);
            localStorage.setItem("token", response.token);
            console.log(response);
            navigate("//login")

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

            <Paper elevation={5} sx={{ width: 400, padding: 4 }}>
                <Typography variant="h5" component="h2">
                    Create Account
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message} />


                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message} />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message} />

                    <Typography>
                        Already have an account?
                        <span style={{ marginLeft: "8px", color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>Sign in</span>
                    </Typography>

                    <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
                        Sign Up
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Register;