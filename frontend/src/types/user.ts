export type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "citizen" | "officer" | "worker" | "admin";
    createdAt: string;
    isActive: boolean;
};



export type Complaint = {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "in_progress" | "resolved" | "rejected";
    assignedOfficer?: string;
};

export type RoleFilter =
    | "all"
    | "citizen"
    | "officer"
    | "worker"
    | "admin";