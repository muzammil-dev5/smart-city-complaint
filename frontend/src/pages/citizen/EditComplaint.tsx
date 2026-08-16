import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComplaintForm, { type ComplaintFormData } from "../../components/complaint/ComplaintForm";
import { getComplaintById, updateComplaint } from "../../services/complaintService";

const EditComplaint = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [initialData, setInitialData] =
        useState<ComplaintFormData | null>(null);

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
                console.error("Failed to fetch complaint:", error);
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
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Edit Complaint</h1>

            <ComplaintForm
                initialData={initialData}
                onSubmit={handleUpdate}
                submitText="Update Complaint"
            />
        </div>
    );
};

export default EditComplaint;