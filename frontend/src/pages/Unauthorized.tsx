import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Box sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Typography variant="h4" gutterBottom >
                    Access Denied
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    You don't have permission to access this page.
                </Typography>
                <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        </div>
    );
}

export default Unauthorized;
