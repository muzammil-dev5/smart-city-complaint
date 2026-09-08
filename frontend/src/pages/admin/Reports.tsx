import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Pagination,
    TextField,
    Typography,
} from "@mui/material";

import {
    BarChart,
    LineChart,
    PieChart,
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

    const [searchDepartment, setSearchDepartment] = useState("");
    const [departmentPage, setDepartmentPage] = useState(1);

    // Default to true so the mount effect never has to call setLoading(true)
    // synchronously - it only ever calls setLoading(false) after the fetch settles.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const departmentsPerPage = 5;

    /* =====================================================
       FETCH REPORTS (used by filter / reset / retry — all
       triggered from event handlers, so setState there is fine)
    ===================================================== */

    const fetchReports = async (
        filters?: {
            fromDate?: string;
            toDate?: string;
        }
    ) => {
        try {
            setLoading(true);
            setError("");

            const data = await getComplaintReports({
                ...(filters?.fromDate && {
                    fromDate: filters.fromDate,
                }),
                ...(filters?.toDate && {
                    toDate: filters.toDate,
                }),
            });

            setReport(data);
            setDepartmentPage(1);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            setError("Failed to load complaint reports.");
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
       -----------------------------------------------------
       No setState is called synchronously in the effect body.
       The first statement to actually run is the awaited call;
       every state update happens in a microtask continuation
       after that, which is what the "no setState in effect"
       rule is checking for. An `ignore` flag guards against a
       late response resolving after the component has
       unmounted or a newer request has started.
    ===================================================== */

    useEffect(() => {
        let ignore = false;

        const loadInitialReports = async () => {
            try {
                const data = await getComplaintReports({});

                if (!ignore) {
                    setReport(data);
                    setDepartmentPage(1);
                }
            } catch (err) {
                console.error("Failed to fetch reports:", err);

                if (!ignore) {
                    setError("Failed to load complaint reports.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadInitialReports();

        return () => {
            ignore = true;
        };
    }, []);

    /* =====================================================
       DEPARTMENT SEARCH + PAGINATION
       -----------------------------------------------------
       Moved above every early return so this hook is called
       on every render, in the same order, no matter what state
       the page is in (loading / error / no data / ready).
    ===================================================== */

    const filteredDepartments = useMemo(() => {
        const departments = report?.departmentReport ?? [];
        const search = searchDepartment.trim().toLowerCase();

        if (!search) {
            return departments;
        }

        return departments.filter((department) =>
            (department.departmentName || "Unknown Department")
                .toLowerCase()
                .includes(search)
        );
    }, [report?.departmentReport, searchDepartment]);

    /* =====================================================
       FILTER HANDLERS
    ===================================================== */

    const handleFilter = () => {
        if (fromDate && toDate && fromDate > toDate) {
            setError("From date cannot be later than To date.");
            return;
        }

        fetchReports({
            fromDate,
            toDate,
        });
    };

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        setError("");
        fetchReports();
    };

    /* =====================================================
       FORMAT HELPERS
    ===================================================== */

    const formatCategory = (category: string) => {
        return category
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    const formatStatus = (status: string) => {
        return status
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading && !report) {
        return (
            <Box className="reports-state">
                <Box className="reports-state-card">
                    <CircularProgress size={36} />

                    <Typography className="reports-state-title">
                        Loading reports
                    </Typography>

                    <Typography className="reports-state-text">
                        Preparing complaint analytics...
                    </Typography>
                </Box>
            </Box>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && !report) {
        return (
            <Box className="reports-state">
                <Box className="reports-state-card">
                    <Box className="reports-error-icon">
                        !
                    </Box>

                    <Typography className="reports-state-title">
                        Unable to load reports
                    </Typography>

                    <Typography className="reports-state-text">
                        {error}
                    </Typography>

                    <Button
                        variant="contained"
                        className="reports-primary-btn"
                        onClick={() => fetchReports()}
                    >
                        Retry
                    </Button>
                </Box>
            </Box>
        );
    }

    if (!report) return null;

    /* =====================================================
       CHART DATA
    ===================================================== */

    const categoryLabels = report.categoryReport.map(
        (item) => formatCategory(item._id)
    );

    const categoryValues = report.categoryReport.map(
        (item) => item.count
    );

    const statusValues = report.statusReport.map(
        (item) => item.count
    );

    const dateLabels = report.dateWiseReport.map(
        (item) => item._id
    );

    const dateValues = report.dateWiseReport.map(
        (item) => item.count
    );

    /* =====================================================
       RESOLUTION RATE
    ===================================================== */

    const resolutionRate =
        report.summary.total > 0
            ? Math.round(
                (report.summary.resolved /
                    report.summary.total) *
                100
            )
            : 0;

    /* =====================================================
       SUMMARY CARDS
    ===================================================== */

    const summaryCards = [
        {
            label: "Total",
            value: report.summary.total,
            type: "total",
        },
        {
            label: "Pending",
            value: report.summary.pending,
            type: "pending",
        },
        {
            label: "Assigned",
            value: report.summary.assigned,
            type: "assigned",
        },
        {
            label: "In Progress",
            value: report.summary.inProgress,
            type: "progress",
        },
        {
            label: "Resolved",
            value: report.summary.resolved,
            type: "resolved",
        },
        {
            label: "Rejected",
            value: report.summary.rejected,
            type: "rejected",
        },
    ];

    const totalDepartmentPages = Math.max(
        1,
        Math.ceil(
            filteredDepartments.length /
            departmentsPerPage
        )
    );

    const visibleDepartments = filteredDepartments.slice(
        (departmentPage - 1) * departmentsPerPage,
        departmentPage * departmentsPerPage
    );

    const handleDepartmentSearch = (
        value: string
    ) => {
        setSearchDepartment(value);
        setDepartmentPage(1);
    };

    /* =====================================================
       MAIN UI
    ===================================================== */

    return (
        <Box className="reports-page">

            {/* =================================================
                TOP HEADER (full width)
            ================================================= */}

            <Card className="reports-hero-card">
                <Box className="reports-hero">

                    <Box className="reports-hero-left">

                        <Box className="reports-hero-icon">
                            R
                        </Box>

                        <Box>
                            <Typography className="reports-eyebrow">
                                ANALYTICS & REPORTING
                            </Typography>

                            <Typography className="reports-title">
                                Complaint Reports
                            </Typography>

                            <Typography className="reports-subtitle">
                                Monitor complaint trends, status
                                distribution and department performance
                                from a single reporting dashboard.
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="resolution-box">

                        <Typography className="resolution-label">
                            Resolution Rate
                        </Typography>

                        <Typography className="resolution-value">
                            {resolutionRate}%
                        </Typography>

                        <Box className="resolution-progress">
                            <Box
                                className="resolution-progress-value"
                                sx={{
                                    width: `${resolutionRate}%`,
                                }}
                            />
                        </Box>

                        <Typography className="resolution-caption">
                            {report.summary.resolved} of{" "}
                            {report.summary.total} resolved
                        </Typography>
                    </Box>

                </Box>
            </Card>

            {/* =================================================
                FILTER BAR (full width)
            ================================================= */}

            <Card className="reports-filter-card">

                <CardContent className="reports-filter-content">

                    <Box className="filter-label">
                        <Typography>
                            Report Period
                        </Typography>

                        <span>
                            Select date range
                        </span>
                    </Box>

                    <Box className="reports-filters">

                        <TextField
                            label="From Date"
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                setFromDate(
                                    e.target.value
                                )
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
                                setToDate(
                                    e.target.value
                                )
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            className="reports-primary-btn"
                            onClick={handleFilter}
                            disabled={loading}
                        >
                            Apply Filter
                        </Button>

                        <Button
                            variant="outlined"
                            className="reports-reset-btn"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </Button>

                        {loading && (
                            <CircularProgress
                                size={20}
                                className="filter-loader"
                            />
                        )}
                    </Box>

                    {error && (
                        <Typography className="filter-error">
                            {error}
                        </Typography>
                    )}

                </CardContent>
            </Card>

            {/* =================================================
                MAIN TWO COLUMN LAYOUT
            ================================================= */}

            <Grid
                container
                spacing={2.5}
                className="reports-main-grid"
            >

                {/* =================================================
                    LEFT COLUMN — cards + table
                ================================================= */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 6,
                    }}
                >
                    <Box className="reports-left-column">

                        {/* SUMMARY */}

                        <Box className="section-heading">
                            <Box>
                                <Typography className="section-title">
                                    Complaint Summary
                                </Typography>

                                <Typography className="section-description">
                                    Current complaint status overview.
                                </Typography>
                            </Box>
                        </Box>

                        <Grid
                            container
                            spacing={1.5}
                            className="summary-grid"
                        >
                            {summaryCards.map(
                                (card) => (
                                    <Grid
                                        key={card.type}
                                        size={{
                                            xs: 6,
                                            sm: 4,
                                        }}
                                    >
                                        <Card
                                            className={`summary-card ${card.type}`}
                                        >
                                            <CardContent>

                                                <Box className="summary-card-top">
                                                    <Box className="summary-card-icon">
                                                        {card.type ===
                                                            "total"
                                                            ? "T"
                                                            : card.type ===
                                                                "pending"
                                                                ? "P"
                                                                : card.type ===
                                                                    "assigned"
                                                                    ? "A"
                                                                    : card.type ===
                                                                        "progress"
                                                                        ? "IP"
                                                                        : card.type ===
                                                                            "resolved"
                                                                            ? "R"
                                                                            : "X"}
                                                    </Box>

                                                    <Box className="summary-dot" />
                                                </Box>

                                                <Typography className="summary-value">
                                                    {card.value}
                                                </Typography>

                                                <Typography className="summary-label">
                                                    {card.label}
                                                </Typography>

                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            )}
                        </Grid>

                        {/* DEPARTMENT TABLE */}

                        <Card className="department-card">

                            <CardContent className="department-content">

                                <Box className="department-heading">

                                    <Box>
                                        <Typography className="section-title">
                                            Department Performance
                                        </Typography>

                                        <Typography className="section-description">
                                            Complaint workload by department.
                                        </Typography>
                                    </Box>

                                    <Box className="department-count">
                                        {report.departmentReport.length}
                                    </Box>

                                </Box>

                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search department..."
                                    value={searchDepartment}
                                    onChange={(e) =>
                                        handleDepartmentSearch(
                                            e.target.value
                                        )
                                    }
                                    className="department-search"
                                />

                                {visibleDepartments.length ===
                                    0 ? (
                                    <Box className="table-empty">
                                        <Typography>
                                            No departments found.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Box className="department-table-wrapper">

                                            <table className="department-table">

                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Department
                                                        </th>
                                                        <th>
                                                            Total
                                                        </th>
                                                        <th>
                                                            Pending
                                                        </th>
                                                        <th>
                                                            Progress
                                                        </th>
                                                        <th>
                                                            Resolved
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {visibleDepartments.map(
                                                        (
                                                            department
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    department._id
                                                                }
                                                            >

                                                                <td>
                                                                    <Box className="department-name">
                                                                        <Box className="department-avatar">
                                                                            {(
                                                                                department.departmentName ||
                                                                                "U"
                                                                            )
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </Box>

                                                                        <Typography>
                                                                            {department.departmentName ||
                                                                                "Unknown Department"}
                                                                        </Typography>
                                                                    </Box>
                                                                </td>

                                                                <td>
                                                                    <span className="table-value total">
                                                                        {
                                                                            department.totalComplaints
                                                                        }
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    <span className="table-value pending">
                                                                        {
                                                                            department.pending
                                                                        }
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    <span className="table-value progress">
                                                                        {
                                                                            department.inProgress
                                                                        }
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    <span className="table-value resolved">
                                                                        {
                                                                            department.resolved
                                                                        }
                                                                    </span>
                                                                </td>

                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>

                                            </table>
                                        </Box>

                                        {totalDepartmentPages >
                                            1 && (
                                                <Box className="table-pagination">

                                                    <Typography className="pagination-info">
                                                        Showing{" "}
                                                        {(
                                                            departmentPage -
                                                            1
                                                        ) *
                                                            departmentsPerPage +
                                                            1}
                                                        -
                                                        {Math.min(
                                                            departmentPage *
                                                            departmentsPerPage,
                                                            filteredDepartments.length
                                                        )}{" "}
                                                        of{" "}
                                                        {
                                                            filteredDepartments.length
                                                        }
                                                    </Typography>

                                                    <Pagination
                                                        count={
                                                            totalDepartmentPages
                                                        }
                                                        page={
                                                            departmentPage
                                                        }
                                                        onChange={(
                                                            _,
                                                            page
                                                        ) =>
                                                            setDepartmentPage(
                                                                page
                                                            )
                                                        }
                                                        size="small"
                                                        shape="rounded"
                                                    />

                                                </Box>
                                            )}
                                    </>
                                )}

                            </CardContent>
                        </Card>

                    </Box>
                </Grid>

                {/* =================================================
                    RIGHT COLUMN — charts stacked (Line, Pie, Bar)
                ================================================= */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 6,
                    }}
                >
                    <Box className="reports-right-column">

                        {/* ===============================
                            LINE CHART
                        =============================== */}

                        <Card className="analytics-card">

                            <CardContent>

                                <Box className="chart-header">

                                    <Box>
                                        <Typography className="chart-title">
                                            Complaints Over Time
                                        </Typography>

                                        <Typography className="chart-description">
                                            Complaint activity trend.
                                        </Typography>
                                    </Box>

                                    <Box className="chart-badge">
                                        TREND
                                    </Box>

                                </Box>

                                <Box className="chart-box line-chart-box">

                                    {dateValues.length > 0 ? (
                                        <LineChart
                                            height={300}
                                            series={[
                                                {
                                                    data: dateValues,
                                                    label: "Complaints",
                                                    curve: "linear",
                                                },
                                            ]}
                                            xAxis={[
                                                {
                                                    scaleType:
                                                        "point",
                                                    data: dateLabels,
                                                },
                                            ]}
                                            yAxis={[
                                                {
                                                    tickMinStep: 1,
                                                },
                                            ]}
                                            margin={{
                                                left: 45,
                                                right: 15,
                                                top: 20,
                                                bottom: 45,
                                            }}
                                        />
                                    ) : (
                                        <Box className="chart-empty">
                                            No complaint data available.
                                        </Box>
                                    )}

                                </Box>

                            </CardContent>
                        </Card>

                        {/* ===============================
                            PIE CHART
                        =============================== */}

                        <Card className="analytics-card">

                            <CardContent>

                                <Box className="chart-header">

                                    <Box>
                                        <Typography className="chart-title">
                                            Complaints by Status
                                        </Typography>

                                        <Typography className="chart-description">
                                            Status distribution across complaints.
                                        </Typography>
                                    </Box>

                                    <Box className="chart-badge">
                                        STATUS
                                    </Box>

                                </Box>

                                <Box className="chart-box pie-chart-box">

                                    {statusValues.length > 0 ? (
                                        <PieChart
                                            height={310}
                                            series={[
                                                {
                                                    data: report.statusReport.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => ({
                                                            id: index,
                                                            value: item.count,
                                                            label: formatStatus(
                                                                item._id
                                                            ),
                                                        })
                                                    ),
                                                    innerRadius: 55,
                                                    outerRadius: 105,
                                                    paddingAngle: 2,
                                                    cornerRadius: 4,
                                                },
                                            ]}
                                            margin={{
                                                top: 10,
                                                bottom: 10,
                                                left: 10,
                                                right: 10,
                                            }}
                                        />
                                    ) : (
                                        <Box className="chart-empty">
                                            No status data available.
                                        </Box>
                                    )}

                                </Box>

                            </CardContent>
                        </Card>

                        {/* ===============================
                            BAR CHART
                        =============================== */}

                        <Card className="analytics-card">

                            <CardContent>

                                <Box className="chart-header">

                                    <Box>
                                        <Typography className="chart-title">
                                            Complaints by Category
                                        </Typography>

                                        <Typography className="chart-description">
                                            Comparison across complaint categories.
                                        </Typography>
                                    </Box>

                                    <Box className="chart-badge">
                                        CATEGORY
                                    </Box>

                                </Box>

                                <Box className="chart-box">

                                    {categoryValues.length > 0 ? (
                                        <BarChart
                                            height={310}
                                            series={[
                                                {
                                                    data: categoryValues,
                                                    label: "Complaints",
                                                },
                                            ]}
                                            xAxis={[
                                                {
                                                    scaleType:
                                                        "band",
                                                    data: categoryLabels,
                                                },
                                            ]}
                                            yAxis={[
                                                {
                                                    tickMinStep: 1,
                                                },
                                            ]}
                                            margin={{
                                                left: 45,
                                                right: 15,
                                                top: 20,
                                                bottom: 55,
                                            }}
                                        />
                                    ) : (
                                        <Box className="chart-empty">
                                            No category data available.
                                        </Box>
                                    )}

                                </Box>

                            </CardContent>
                        </Card>

                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Reports;
