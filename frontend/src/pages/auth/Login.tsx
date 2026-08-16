import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

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
        .required("Password is required")
});


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await loginUser(data);
            dispatch(
                login({
                    user: response.user,
                    token: response.token
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

            console.log(response);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={5} sx={{ width: 400, padding: 4 }}>

                <Typography variant="h5" component="h2">
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
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
                        Don't  have an account?
                        <span style={{ marginLeft: "8px", color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>Sign up</span>
                    </Typography>

                    <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}> Sign In </Button>
                </form>
            </Paper>
        </Box>
    );

};


export default Login;