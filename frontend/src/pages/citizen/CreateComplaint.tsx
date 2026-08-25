import { Box, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ComplaintForm, { type ComplaintFormData } from "../../components/complaint/ComplaintForm";
import { createComplaint } from "../../services/complaintService";
import "./CreateComplaint.scss";

const CreateComplaint = () => {
    const navigate = useNavigate();

    const handleCreate = async (data: ComplaintFormData) => {
        try {
            await createComplaint(data);
            navigate("/citizen/complaints");
        } catch (error) {
            console.error("Create complaint error:", error);
        }
    };

    return (
        <Box className="createComplaint">
            <Box className="createComplaint_header">
                <Button
                    className="createComplaint_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/citizen/complaints")}>
                    Back to Complaints
                </Button>

                <Typography className="createComplaint_title">
                    Create Complaint
                </Typography>

                <Typography className="createComplaint_subtitle">
                    Submit a new complaint and provide the details below.
                </Typography>
            </Box>

            <Box className="createComplaint_card">
                <Box className="createComplaint_cardHeader">
                    <Typography className="createComplaint_cardTitle">
                        Complaint Information
                    </Typography>

                    <Typography className="createComplaint_cardSubtitle">
                        Please provide accurate information about the issue.
                    </Typography>
                </Box>

                <ComplaintForm
                    onSubmit={handleCreate}
                    submitText="Create Complaint"
                />
            </Box>
        </Box>
    );
};
export default CreateComplaint;