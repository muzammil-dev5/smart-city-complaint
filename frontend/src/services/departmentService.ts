import api from "./api";

export type CreateDepartmentData = {
    name: string;
    description: string;
};

export const getAllDepartments = async () => {
    const response = await api.get("/departments");

    return response.data;
};

export const createDepartment = async (
    data: CreateDepartmentData
) => {
    const response = await api.post(
        "/departments",
        data
    );

    return response.data;
};

export const getActiveDepartments = async () => {
    const response = await api.get("/departments/active");

    return response.data;
};

export const updateDepartment = async (
    id: string,
    data: {
        name?: string;
        description?: string;
        isActive?: boolean;
    }
) => {
    const response = await api.put(
        `/departments/${id}`,
        data
    );

    return response.data;
};