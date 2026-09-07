import api from "./api";

export interface ComplaintReportFilters {
    fromDate?: string;
    toDate?: string;
}

export interface ComplaintReport {
    dateRange: {
        fromDate: string | null;
        toDate: string | null;
    };

    summary: {
        total: number;
        pending: number;
        assigned: number;
        inProgress: number;
        resolved: number;
        rejected: number;
    };

    categoryReport: {
        _id: string;
        count: number;
    }[];

    statusReport: {
        _id: string;
        count: number;
    }[];

    departmentReport: {
        _id: string;
        departmentName: string;
        totalComplaints: number;
        resolved: number;
        pending: number;
        inProgress: number;
    }[];

    dateWiseReport: {
        _id: string;
        count: number;
    }[];
}

export const getComplaintReports = async (
    filters?: ComplaintReportFilters
) => {
    const response = await api.get("/complaints/reports", {
        params: filters,
    });

    return response.data.report as ComplaintReport;
};