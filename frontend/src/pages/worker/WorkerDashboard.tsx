import { Box, Paper, Typography } from '@mui/material';

const WorkerDashboard = () => {
    return (
        <>
            <Box>
                <Typography variant="h4" gutterBottom>Worker Dashboard</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}> View and manage your assigned work.</Typography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)"
                    }, gap: 2
                }}>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Assigned Tasks </Typography>
                        <Typography variant="h4"> 0 </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Pending </Typography>
                        <Typography variant="h4"> 0 </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> In Progress </Typography>
                        <Typography variant="h4"> 0 </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6"> Completed </Typography>
                        <Typography variant="h4"> 0 </Typography>
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default WorkerDashboard;
