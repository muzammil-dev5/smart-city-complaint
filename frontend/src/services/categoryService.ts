import api from "./api";

export type ComplaintCategory = {
    _id: string;
    value: string;
    name: string;
    urduName: string;
    isActive: boolean;
};

export const getCategories = async (): Promise<ComplaintCategory[]> => {
    const response = await api.get("/categories");

    return response.data.categories;
};