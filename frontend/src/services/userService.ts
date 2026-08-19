import api from "./api";

export const getOfficers = async () => {
    const response = await api.get("/users/officers", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return response.data;
}

export const getAllUsers = async () => {
    const response = await api.get("/users");

    return response.data;
};

export const updateUserRole = async (userId: string, role: string) => {
    const response = await api.put(`/users/${userId}/role`, { role });

    return response.data;
}

export const updateUserStatus = async (userId: string, isActive: boolean) => {
    const response = await api.put(`/users/${userId}/status`, { isActive });

    return response.data;
}

export const getWorkers = async () => {
    const response = await api.get("/users/workers");
    return response.data;
};