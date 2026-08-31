import api from "./api";

export interface FeedbackData {
    complaintId: string;
    rating: number;
    comment?: string;
}

export const createFeedback = async (
    data: FeedbackData
) => {
    const response = await api.post(
        "/feedback",
        data
    );

    return response.data;
};

export const getComplaintFeedback = async (
    complaintId: string
) => {
    const response = await api.get(
        `/feedback/${complaintId}`
    );

    return response.data;
};

export const getAllFeedback = async () => {
    const response = await api.get(
        "/feedback"
    );

    return response.data;
};
