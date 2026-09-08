import {
    Box,
    Chip,
    CircularProgress,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { ChatBubbleOutlineRounded, GroupsOutlined, Star, StarBorder, TrendingUp } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { getAllFeedback } from "../../services/feedbackService";
import { BarChart } from "@mui/x-charts/BarChart";
import "./AdminFeedback.scss";

interface Feedback {
    _id: string;
    rating: number;
    comment?: string;
    createdAt: string;

    citizen: {
        _id: string;
        name: string;
        email: string;
    };

    complaint: {
        _id: string;
        title: string;
        status: string;
    };
}

const AdminFeedback = () => {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await getAllFeedback();
                setFeedback(response.feedback);
            } catch (error) {
                console.error("Failed to fetch feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const filteredFeedback = useMemo(() => {
        return feedback.filter((item) => {
            const search = searchTerm.toLowerCase().trim();

            const matchesSearch =
                item.citizen?.name?.toLowerCase().includes(search) ||
                item.citizen?.email?.toLowerCase().includes(search) ||
                item.complaint?.title?.toLowerCase().includes(search) ||
                item.comment?.toLowerCase().includes(search);

            const matchesRating =
                ratingFilter === "all" ||
                item.rating === ratingFilter;

            const feedbackDate = new Date(item.createdAt);

            const matchesFromDate =
                !fromDate ||
                feedbackDate >= new Date(`${fromDate}T00:00:00`);

            const matchesToDate =
                !toDate ||
                feedbackDate <= new Date(`${toDate}T23:59:59`);

            return (
                matchesSearch &&
                matchesRating &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [
        feedback,
        searchTerm,
        ratingFilter,
        fromDate,
        toDate,
    ]);

    const averageRating = useMemo(() => {
        if (!feedback.length) return 0;

        return (
            feedback.reduce(
                (sum, item) => sum + item.rating,
                0
            ) / feedback.length
        );
    }, [feedback]);

    const formattedAverageRating = averageRating.toFixed(1);

    const fiveStarCount = feedback.filter(
        (item) => item.rating === 5
    ).length;

    const positivePercentage = feedback.length
        ? Math.round((fiveStarCount / feedback.length) * 100)
        : 0;

    const ratingDistribution = [1, 2, 3, 4, 5].map(
        (rating) => ({
            rating,
            count: feedback.filter(
                (item) => item.rating === rating
            ).length,
        })
    );

    const getInitials = (name?: string) => {
        if (!name) return "?";

        return name
            .split(" ")
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase();
    };

    const formatStatus = (status?: string) => {
        if (!status) return "Unknown";

        if (status === "in_progress") {
            return "In Progress";
        }

        return status
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    };

    const clearFilters = () => {
        setSearchTerm("");
        setRatingFilter("all");
        setFromDate("");
        setToDate("");
    };

    const hasActiveFilters =
        !!searchTerm ||
        ratingFilter !== "all" ||
        !!fromDate ||
        !!toDate;

    if (loading) {
        return (
            <Box className="adminFeedback-loading">
                <CircularProgress size={34} />

                <Typography>
                    Loading citizen feedback...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="adminFeedback">

            {/* =====================================================
                MAIN GRID
                left  -> header + data table
                right -> stat cards + chart
            ===================================================== */}

            <Box className="adminFeedback-mainGrid">

                {/* ------------------- HEADER (full width, top) ------------------- */}
                <Box className="adminFeedback-headerCell">

                    <Box className="adminFeedback-headerTop">

                        <Box className="adminFeedback-pageHeaderContent">
                            <Box className="adminFeedback-titleIcon">
                                <ChatBubbleOutlineRounded />
                            </Box>

                            <Box>
                                <Typography className="adminFeedback-heading">
                                    Citizen Feedback
                                </Typography>

                                <Typography className="adminFeedback-subtitle">
                                    Monitor citizen satisfaction and review
                                    feedback submitted across complaints.
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="adminFeedback-headerBadge">
                            <TrendingUp />

                            <Box>
                                <Typography className="adminFeedback-badgeLabel">
                                    Satisfaction
                                </Typography>

                                <Typography className="adminFeedback-badgeValue">
                                    {positivePercentage}%
                                </Typography>
                            </Box>
                        </Box>

                    </Box>

                </Box>

                {/* ------------------- FULL-WIDTH DIVIDER ------------------- */}
                <Box className="adminFeedback-hDivider" />

                {/* ------------------- VERTICAL DIVIDER (content row only) ------------------- */}
                <Box className="adminFeedback-vDivider" />

                {/* ------------------- DATA TABLE (bottom-left) ------------------- */}
                <Box className="adminFeedback-tableCell">

                    <Box className="adminFeedback-sectionHeader">
                        <Box className="adminFeedback-sectionTitleRow">
                            <Typography className="adminFeedback-cardTitle">
                                Rating Data Table
                            </Typography>

                            <Chip
                                label={`${filteredFeedback.length} Results`}
                                size="small"
                                className="adminFeedback-resultChip"
                            />
                        </Box>

                        <Typography className="adminFeedback-cardSubtitle">
                            Review citizen ratings, comments and complaint
                            status.
                        </Typography>
                    </Box>

                    {/* FILTER TOOLBAR */}
                    <Box className="adminFeedback-filterWrapper">

                        <Box className="adminFeedback-filterHeader">
                            <Typography>Filter Feedback</Typography>

                            {hasActiveFilters && (
                                <Typography
                                    className="adminFeedback-clearFilter"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Typography>
                            )}
                        </Box>

                        <Box className="adminFeedback-filters">

                            <TextField
                                size="small"
                                placeholder="Search citizen, complaint or comment..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="adminFeedback-search"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />

                            <FormControl size="small" className="adminFeedback-ratingFilter">
                                <InputLabel>Rating</InputLabel>

                                <Select
                                    value={ratingFilter}
                                    label="Rating"
                                    onChange={(e) =>
                                        setRatingFilter(
                                            e.target.value === "all"
                                                ? "all"
                                                : Number(e.target.value)
                                        )
                                    }
                                >
                                    <MenuItem value="all">All Ratings</MenuItem>
                                    <MenuItem value={5}>⭐ 5 Stars</MenuItem>
                                    <MenuItem value={4}>⭐ 4 Stars</MenuItem>
                                    <MenuItem value={3}>⭐ 3 Stars</MenuItem>
                                    <MenuItem value={2}>⭐ 2 Stars</MenuItem>
                                    <MenuItem value={1}>⭐ 1 Star</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                size="small"
                                type="date"
                                label="From"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                slotProps={{ inputLabel: { shrink: true } }}
                                className="adminFeedback-dateFilter"
                            />

                            <TextField
                                size="small"
                                type="date"
                                label="To"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                slotProps={{ inputLabel: { shrink: true } }}
                                className="adminFeedback-dateFilter"
                            />

                        </Box>

                    </Box>

                    {/* TABLE */}
                    <TableContainer className="adminFeedback-tableContainer">
                        <Table stickyHeader className="adminFeedback-table">

                            <TableHead>
                                <TableRow>
                                    <TableCell>Citizen</TableCell>
                                    <TableCell>Complaint</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Comment</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Submitted</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredFeedback.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Box className="adminFeedback-empty">
                                                <Box className="adminFeedback-emptyIcon">
                                                    <ChatBubbleOutlineRounded />
                                                </Box>

                                                <Typography className="adminFeedback-emptyTitle">
                                                    No feedback found
                                                </Typography>

                                                <Typography className="adminFeedback-emptyText">
                                                    {hasActiveFilters
                                                        ? "Try adjusting your filters to find feedback."
                                                        : "No citizen feedback has been submitted yet."}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFeedback.map((item) => (
                                        <TableRow key={item._id} className="adminFeedback-tableRow">

                                            <TableCell>
                                                <Box className="feedback-citizen">
                                                    <Box className="feedback-citizenAvatar">
                                                        {getInitials(item.citizen?.name)}
                                                    </Box>

                                                    <Box className="feedback-citizenInfo">
                                                        <Typography className="feedback-citizenName">
                                                            {item.citizen?.name || "Unknown Citizen"}
                                                        </Typography>

                                                        <Typography className="feedback-citizenEmail">
                                                            {item.citizen?.email || "-"}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box className="feedback-complaint">
                                                    <Typography className="feedback-complaintTitle">
                                                        {item.complaint?.title || "Unknown Complaint"}
                                                    </Typography>

                                                    <Typography className="feedback-complaintId">
                                                        ID: {item.complaint?._id?.slice(-8)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box className="feedback-rating">
                                                    <Rating
                                                        value={item.rating}
                                                        readOnly
                                                        size="small"
                                                        emptyIcon={<StarBorder fontSize="inherit" />}
                                                    />

                                                    <Typography>{item.rating}.0</Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Typography className="feedback-comment">
                                                    {item.comment?.trim()
                                                        ? item.comment
                                                        : "No comment provided"}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={formatStatus(item.complaint?.status)}
                                                    className={`feedback-status feedback-status-${item.complaint?.status}`}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Box className="feedback-dateWrapper">
                                                    <Typography className="feedback-date">
                                                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </Typography>

                                                    <Typography className="feedback-time">
                                                        {new Date(item.createdAt).toLocaleTimeString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>

                </Box>

                {/* ------------------- RIGHT COLUMN: stat cards + chart (bottom-right) ------------------- */}
                <Box className="adminFeedback-rightCell">

                    {/* Stat cards start here, below the header */}
                    <Box className="adminFeedback-statsGrid2">

                        {/* Average Rating */}
                        <Box className="adminFeedback-statCard">
                            <Box className="adminFeedback-statIcon purple">
                                <Star />
                            </Box>

                            <Box className="adminFeedback-statContent">
                                <Typography className="adminFeedback-statLabel">
                                    Average Rating
                                </Typography>

                                <Box className="adminFeedback-statRating">
                                    <Typography className="adminFeedback-statValue">
                                        {formattedAverageRating}
                                    </Typography>

                                    <Rating
                                        value={averageRating}
                                        precision={0.1}
                                        readOnly
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Total Feedback */}
                        <Box className="adminFeedback-statCard">
                            <Box className="adminFeedback-statIcon blue">
                                <ChatBubbleOutlineRounded />
                            </Box>

                            <Box className="adminFeedback-statContent">
                                <Typography className="adminFeedback-statLabel">
                                    Total Feedback
                                </Typography>

                                <Typography className="adminFeedback-statValue">
                                    {feedback.length}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Five Star */}
                        <Box className="adminFeedback-statCard">
                            <Box className="adminFeedback-statIcon amber">
                                <Star />
                            </Box>

                            <Box className="adminFeedback-statContent">
                                <Typography className="adminFeedback-statLabel">
                                    5-Star Feedback
                                </Typography>

                                <Typography className="adminFeedback-statValue">
                                    {fiveStarCount}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Satisfaction */}
                        <Box className="adminFeedback-statCard">
                            <Box className="adminFeedback-statIcon green">
                                <GroupsOutlined />
                            </Box>

                            <Box className="adminFeedback-statContent">
                                <Typography className="adminFeedback-statLabel">
                                    Satisfaction Rate
                                </Typography>

                                <Typography className="adminFeedback-statValue">
                                    {positivePercentage}%
                                </Typography>
                            </Box>
                        </Box>

                    </Box>

                    {/* Inner divider between cards and chart */}
                    <Box className="adminFeedback-innerDivider" />

                    {/* Chart */}
                    <Box className="adminFeedback-chartInner">

                        <Box className="adminFeedback-cardHeader">
                            <Box>
                                <Typography className="adminFeedback-cardTitle">
                                    Rating Chart
                                </Typography>

                                <Typography className="adminFeedback-cardSubtitle">
                                    Distribution of citizen ratings.
                                </Typography>
                            </Box>

                            <Box className="adminFeedback-chartLegend">
                                <Star fontSize="small" />
                                <Typography>Citizen Ratings</Typography>
                            </Box>
                        </Box>

                        <Box className="adminFeedback-chart">
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        data: ratingDistribution.map((item) => `${item.rating} Star`),
                                    },
                                ]}
                                series={[
                                    {
                                        data: ratingDistribution.map((item) => item.count),
                                        label: "Feedback",
                                    },
                                ]}
                                height={240}
                                margin={{ left: 45, right: 20, top: 20, bottom: 40 }}
                            />
                        </Box>

                    </Box>

                </Box>

            </Box>

        </Box>
    );
};

export default AdminFeedback;
