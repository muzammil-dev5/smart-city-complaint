import api from "./api"

export interface CreateComplaintData {
    title: string;
    description: string;
    category: string;
    address: string;
    latitude?: number;
    longitude?: number;
    images?: File[];
    existingImages?: string[];
}

export const createComplaint = async (
    data: CreateComplaintData
) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);

    formData.append(
        "location",
        JSON.stringify({
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude
        })
    );

    if (data.existingImages) {
        formData.append(
            "existingImages",
            JSON.stringify(data.existingImages)
        );
    }

    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append("images", image);
        });
    }

    const response = await api.post(
        "/complaints",
        formData
    );

    return response.data;
};

export const getMyComplaints = async () => {
    const response = await api.get("/complaints/my");

    return response.data;
};

export const getComplaintById = async (id: string) => {
    const response = await api.get(`/complaints/${id}`);

    return response.data;
};

export const updateComplaint = async (
    id: string,
    data: CreateComplaintData
) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("address", data.address);

    formData.append(
        "location",
        JSON.stringify({
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude
        })
    );

    formData.append(
        "existingImages",
        JSON.stringify(data.existingImages || [])
    );

    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append("images", image);
        });
    }

    const response = await api.put(
        `/complaints/${id}`,
        formData
    );

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
    departmentId: string,
    officerId: string
) => {
    const response = await api.put(
        `/complaints/${complaintId}/assign`,
        {
            departmentId,
            officerId
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

export const getWorkerComplaints = async () => {
    const response = await api.get("/complaints/worker");
    return response.data;
};

export const assignWorker = async (
    complaintId: string,
    workerId: string
) => {
    const response = await api.put(
        `/complaints/${complaintId}/assign-worker`,
        {
            workerId
        }
    );

    return response.data;
};

export const getWorkerComplaintById = async (id: string) => {
    const response = await api.get(`/complaints/worker/${id}`);

    return response.data;
};

export const updateWorkerComplaintStatus = async (id: string, status: string) => {
    const response = await api.patch(
        `/complaints/worker/${id}/status`,
        { status }
    );

    return response.data;
};

export const getComplaintAnalytics = async () => {
    const response = await api.get("/complaints/analytics");

    return response.data;
};

export const getComplaintActivities = async (
    id: string
) => {
    const response = await api.get(
        `/complaints/${id}/activities`
    );

    return response.data;
};