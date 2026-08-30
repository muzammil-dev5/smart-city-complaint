import api from "./api";

export interface Notification {
    _id: string;
    recipient: string;
    complaint:
    | string
    | {
        _id: string;
        title?: string;
        status?: string;
    }
    | null;
    type:
    | "complaint_created"
    | "complaint_assigned"
    | "complaint_started"
    | "worker_assigned"
    | "complaint_resolved"
    | "feedback_requested";
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getMyNotifications = async () => {
    const response = await api.get("/notifications");

    return response.data;
};


export const getUnreadNotificationCount = async () => {
    const response = await api.get(
        "/notifications/unread-count"
    );

    return response.data;
};

export const markNotificationAsRead = async (
    notificationId: string
) => {
    const response = await api.patch(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch(
        "/notifications/read-all"
    );

    return response.data;
};