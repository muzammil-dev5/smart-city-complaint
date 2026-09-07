import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    // FormControl,
    Grid,
    // InputLabel,
    // MenuItem,
    // Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    BarChart,
    PieChart,
    LineChart,
} from "@mui/x-charts";

import {
    getComplaintReports,
    type ComplaintReport,
} from "../../services/complaintReportService";

import "./Reports.scss";

const Reports = () => {
    const [report, setReport] = useState<ComplaintReport | null>(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getComplaintReports({
                ...(fromDate && { fromDate }),
                ...(toDate && { toDate }),
            });

            setReport(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            setError("Failed to load complaint reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getComplaintReports({});

                setReport(data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                setError("Failed to load complaint reports.");
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    const handleFilter = () => {
        fetchReports();
    };

    const handleReset = () => {
        setFromDate("");
        setToDate("");

        setTimeout(() => {
            getComplaintReports({})
                .then((data) => setReport(data))
                .catch(() => setError("Failed to load complaint reports."));
        }, 0);
    };

    const formatCategory = (category: string) => {
        return category
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const formatStatus = (status: string) => {
        return status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (loading && !report) {
        return (
            <Box className="reports-loading">
                <CircularProgress />
                <Typography>Loading reports...</Typography>
            </Box>
        );
    }

    if (error && !report) {
        return (
            <Box className="reports-error">
                <Typography>{error}</Typography>
                <Button variant="contained" onClick={fetchReports}>
                    Retry
                </Button>
            </Box>
        );
    }

    if (!report) return null;

    const categoryLabels = report.categoryReport.map((item) =>
        formatCategory(item._id)
    );

    const categoryValues = report.categoryReport.map(
        (item) => item.count
    );

    // const statusLabels = report.statusReport.map((item) =>
    //     formatStatus(item._id)
    // );

    const statusValues = report.statusReport.map(
        (item) => item.count
    );

    const dateLabels = report.dateWiseReport.map(
        (item) => item._id
    );

    const dateValues = report.dateWiseReport.map(
        (item) => item.count
    );

    return (
        <Box className="reports-page">

            {/* Header */}
            <Box className="reports-header">
                <Box>
                    <Typography className="reports-title">
                        Complaint Reports
                    </Typography>

                    <Typography className="reports-subtitle">
                        Analyze complaint trends, categories and department
                        performance.
                    </Typography>
                </Box>
            </Box>

            {/* Filters */}
            <Card className="reports-filter-card">
                <CardContent>
                    <Box className="reports-filter-header">
                        <Typography className="reports-section-title">
                            Report Filters
                        </Typography>

                        {loading && (
                            <CircularProgress size={22} />
                        )}
                    </Box>

                    <Box className="reports-filters">

                        <TextField
                            label="From Date"
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                setFromDate(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <TextField
                            label="To Date"
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                setToDate(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={handleFilter}
                            disabled={loading}
                        >
                            Apply Filter
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Summary */}
            <Typography className="reports-section-title">
                Complaint Summary
            </Typography>

            <Grid container spacing={2} className="reports-summary">

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card className="report-stat-card">
                        <CardContent>
                            <Typography className="report-stat-label">
                                Total
                            </Typography>

                            <Typography className="report-stat-value">
                                {report.summary.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card className="report-stat-card pending">
                        <CardContent>
                            <Typography className="report-stat-label">
                                Pending
                            </Typography>

                            <Typography className="report-stat-value">
                                {report.summary.pending}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card className="report-stat-card assigned">
                        <CardContent>
                            <Typography className="report-stat-label">
                                Assigned
                            </Typography>

                            <Typography className="report-stat-value">
                                {report.summary.assigned}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card className="report-stat-card progress">
                        <CardContent>
                            <Typography className="report-stat-label">
                                In Progress
                            </Typography>

                            <Typography className="report-stat-value">
                                {report.summary.inProgress}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card className="report-stat-card resolved">
                        <CardContent>
                            <Typography className="report-stat-label">
                                Resolved
                            </Typography>

                            <Typography className="report-stat-value">
                                {report.summary.resolved}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card className="report-stat-card rejected">
                        <CardContent>
                            <Typography className="report-stat-label">
                                Rejected
                            </Typography>

                            <Typography className="report-stat-value">
                                {report.summary.rejected}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* Charts */}
            <Grid container spacing={3} className="reports-charts">

                {/* Date Wise */}
                <Grid size={{ xs: 12 }}>
                    <Card className="report-chart-card">
                        <CardContent>
                            <Typography className="reports-section-title">
                                Complaints Over Time
                            </Typography>

                            {dateValues.length > 0 ? (
                                <LineChart
                                    height={330}
                                    series={[
                                        {
                                            data: dateValues,
                                            label: "Complaints",
                                            curve: "linear",
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            scaleType: "point",
                                            data: dateLabels,
                                        },
                                    ]}
                                />
                            ) : (
                                <Typography className="no-report-data">
                                    No complaint data available.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Category */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="report-chart-card">
                        <CardContent>
                            <Typography className="reports-section-title">
                                Complaints by Category
                            </Typography>

                            {categoryValues.length > 0 ? (
                                <BarChart
                                    height={320}
                                    series={[
                                        {
                                            data: categoryValues,
                                            label: "Complaints",
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            scaleType: "band",
                                            data: categoryLabels,
                                        },
                                    ]}
                                />
                            ) : (
                                <Typography className="no-report-data">
                                    No category data available.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Status */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="report-chart-card">
                        <CardContent>
                            <Typography className="reports-section-title">
                                Complaints by Status
                            </Typography>

                            {statusValues.length > 0 ? (
                                <PieChart
                                    height={320}
                                    series={[
                                        {
                                            data: report.statusReport.map(
                                                (item, index) => ({
                                                    id: index,
                                                    value: item.count,
                                                    label: formatStatus(
                                                        item._id
                                                    ),
                                                })
                                            ),
                                        },
                                    ]}
                                />
                            ) : (
                                <Typography className="no-report-data">
                                    No status data available.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* Department Report */}
            <Card className="department-report-card">
                <CardContent>
                    <Typography className="reports-section-title">
                        Department Performance
                    </Typography>

                    {report.departmentReport.length === 0 ? (
                        <Typography className="no-report-data">
                            No department data available.
                        </Typography>
                    ) : (
                        <Box className="department-table-wrapper">
                            <table className="department-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Total</th>
                                        <th>Pending</th>
                                        <th>In Progress</th>
                                        <th>Resolved</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {report.departmentReport.map(
                                        (department) => (
                                            <tr key={department._id}>
                                                <td>
                                                    {department.departmentName ||
                                                        "Unknown Department"}
                                                </td>

                                                <td>
                                                    {department.totalComplaints}
                                                </td>

                                                <td>
                                                    {department.pending}
                                                </td>

                                                <td>
                                                    {department.inProgress}
                                                </td>

                                                <td>
                                                    {department.resolved}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </CardContent>
            </Card>

        </Box>
    );
};

export default Reports;