import { useNavigate } from "react-router-dom";
import ComplaintForm, { type ComplaintFormData } from "../../components/complaint/ComplaintForm";
import { createComplaint } from "../../services/complaintService";


const CreateComplaint = () => {
    const navigate = useNavigate();

    const handleCreate = async (data: ComplaintFormData) => {
        try {
            await createComplaint(data);
            navigate("/citizen/complaints")
        } catch (error) {
            console.error("Create complaint error:", error)
        }
    }

    return (
        <>
            <h1>Create Complaint</h1>
            <ComplaintForm
                onSubmit={handleCreate}
                submitText="Create Complaint"
            />
        </>
    )
}
export default CreateComplaint;