export type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "citizen" | "officer" | "worker" | "admin";
    createdAt: string;
    isActive: boolean;
};

export type RoleFilter =
    | "all"
    | "citizen"
    | "officer"
    | "worker"
    | "admin";


export type StatusHistory = {
    status: "pending" | "in_progress" | "resolved" | "rejected";
    changedAt: string
};

export type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "in_progress" | "resolved" | "rejected";
    createdAt: string;
    statusHistory: StatusHistory[];
    citizen?: {
        _id: string;
        name: string;
        email: string;
    };
    assignedOfficer?: {
        _id: string;
        name: string;
        email: string;
    } | null;
    worker?: {
        _id: string;
        name: string;
        email: string;
    } | null;

};

export type Worker = {
    _id: string;
    name: string;
    email: string;
};

export type Officer = {
    _id: string;
    name: string;
    email: string;
};