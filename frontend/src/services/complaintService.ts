import api from "./api"

export interface CreateComplaintData {
    title: string,
    description: string,
    category: string,
    address: string
}

export const createComplaint = async (data: CreateComplaintData) => {
    const response = await api.post("/complaints", {
        title: data.title,
        description: data.description,
        category: data.category,
        location: {
            address: data.address
        }
    })
    return response.data;
}

export const getMyComplaints = async () => {
    const response = await api.get("/complaints/my");

    return response.data;
};

export const getComplaintById = async (id: string) => {
    const response = await api.get(`/complaints/${id}`);

    return response.data;
};

export const updateComplaint = async (id: string, data: CreateComplaintData) => {
    const response = await api.put(`/complaints/${id}`, data);

    return response.data;
};

export const deleteComplaint = async (id: string) => {
    const response = await api.delete(`/complaints/${id}`);

    return response.data;
};

export const getAssignedComplaints = async () => {
    const response = await api.get("/complaints/assigned", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;
};

export const getAllComplaints = async () => {
    const response = await api.get("/complaints/all", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;
};

export const assignComplaint = async (
    complaintId: string,
    officerId: string
) => {
    const response = await api.put(
        `/complaints/${complaintId}/assign`,
        {
            officerId
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    return response.data;
};

export const updateComplaintStatus = async (
    id: string,
    status: string
) => {
    const response = await api.patch(
        `/complaints/${id}/status`,
        { status }
    );

    return response.data;
};


export const getAssignedComplaintById = async (id: string) => {
    const response = await api.get(`/complaints/assigned/${id}`);
    return response.data;
};