import api from "./api";

export interface UserProfile {
    _id: string;
    id?: string;
    name: string;
    email: string;
    address?: string;
    phone?: string;
    role: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateProfileData {
    name: string;
    phone?: string;
    address?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}


// ================= GET PROFILE =================

export const getMyProfile = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};


// ================= UPDATE PROFILE =================

export const updateMyProfile = async (
    data: UpdateProfileData
) => {
    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;
};


// ================= CHANGE PASSWORD =================

export const changeMyPassword = async (
    data: ChangePasswordData
) => {
    const response = await api.put(
        "/auth/change-password",
        data
    );

    return response.data;
};