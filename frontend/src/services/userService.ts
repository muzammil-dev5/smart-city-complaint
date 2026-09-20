import api from "./api";

export const getOfficers = async (departmentId?: string) => {
    const response = await api.get("/users/officers", {
        params: departmentId
            ? { departmentId }
            : undefined,
    });

    return response.data;
};

export const getWorkers = async (departmentId?: string) => {
    const response = await api.get("/users/workers", {
        params: departmentId
            ? { departmentId }
            : undefined,
    });

    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/users");

    return response.data;
};

export const updateUserRole = async (
    userId: string,
    role: string
) => {
    const response = await api.put(
        `/users/${userId}/role`,
        { role }
    );

    return response.data;
};

export const updateUserStatus = async (
    userId: string,
    isActive: boolean
) => {
    const response = await api.put(
        `/users/${userId}/status`,
        { isActive }
    );

    return response.data;
};

export const updateUserDepartment = async (
    userId: string,
    departmentId: string
) => {
    const response = await api.put(
        `/users/${userId}/department`,
        { departmentId }
    );

    return response.data;
};