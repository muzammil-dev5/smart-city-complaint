import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import ComplaintForm, { type ComplaintFormData } from "../../components/complaint/ComplaintForm";
import { getComplaintById, updateComplaint } from "../../services/complaintService";
import "./EditComplaint.scss";

const EditComplaint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<ComplaintFormData | null>(null);

    useEffect(() => {
        const fetchComplaint = async () => {
            if (!id) return;

            try {
                const response = await getComplaintById(id);
                const complaint = response.complaint;

                setInitialData({
                    title: complaint.title,
                    description: complaint.description,
                    category: complaint.category,
                    address: complaint.location?.address || ""
                });
            } catch (error) {
                console.error(
                    "Failed to fetch complaint:",
                    error
                );
            }
        };

        fetchComplaint();
    }, [id]);

    const handleUpdate = async (
        data: ComplaintFormData
    ) => {
        if (!id) return;

        try {
            await updateComplaint(id, data);
            navigate(`/citizen/complaints/${id}`);
        } catch (error) {
            console.error("Update complaint error:", error);
        }
    };

    if (!initialData) {
        return (
            <Box className="editComplaint_loading">
                <Typography>
                    Loading complaint...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="editComplaint">
            <Box className="editComplaint_header">
                <Button
                    className="editComplaint_backButton"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            `/citizen/complaints/${id}`)}>
                    Back to Complaint
                </Button>

                <Typography className="editComplaint_title">
                    Edit Complaint
                </Typography>

                <Typography className="editComplaint_subtitle">
                    Update the information of your complaint below.
                </Typography>
            </Box>

            <Box className="editComplaint_card">
                <Box className="editComplaint_cardHeader">
                    <Typography className="editComplaint_cardTitle">
                        Complaint Information
                    </Typography>

                    <Typography className="editComplaint_cardSubtitle">
                        Make the necessary changes and save your updates.
                    </Typography>
                </Box>

                <ComplaintForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    submitText="Update Complaint"
                />
            </Box>
        </Box>
    );
};

export default EditComplaint;