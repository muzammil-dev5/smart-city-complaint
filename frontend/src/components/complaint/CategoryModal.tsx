import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    IconButton,
    Typography,
} from "@mui/material";

import { CloseOutlined } from "@mui/icons-material";

import {
    ConstructionOutlined,
    LightbulbOutlined,
    DeleteOutlineOutlined,
    WaterDropOutlined,
    PlumbingOutlined,
    TrafficOutlined,
    ParkOutlined,
    GavelOutlined,
} from "@mui/icons-material";

import { getCategories } from "../../services/categoryService";
import type { ComplaintCategory as ApiComplaintCategory } from "../../services/categoryService";

import "./CategoryModal.scss";

export type ComplaintCategory = {
    value: string;
    name: string;
    urduName: string;
    icon: ReactNode;
};

type CategoryModalProps = {
    open: boolean;
    selectedCategory?: string;
    onClose: () => void;
    onSelect: (category: ComplaintCategory) => void;
};

const categoryIcons: Record<string, ReactNode> = {
    road_damage: <ConstructionOutlined />,
    street_light: <LightbulbOutlined />,
    garbage_collection: <DeleteOutlineOutlined />,
    water_leakage: <WaterDropOutlined />,
    drainage: <PlumbingOutlined />,
    traffic_signal: <TrafficOutlined />,
    fallen_tree: <ParkOutlined />,
    illegal_construction: <GavelOutlined />,
};

const CategoryModal = ({
    open,
    selectedCategory,
    onClose,
    onSelect,
}: CategoryModalProps) => {
    const [categories, setCategories] = useState<
        ComplaintCategory[]
    >([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) {
            return;
        }

        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError("");

                const data: ApiComplaintCategory[] =
                    await getCategories();

                const categoriesWithIcons: ComplaintCategory[] =
                    data.map((category) => ({
                        value: category.value,
                        name: category.name,
                        urduName: category.urduName,
                        icon:
                            categoryIcons[category.value] || (
                                <ConstructionOutlined />
                            ),
                    }));

                setCategories(categoriesWithIcons);
            } catch (error) {
                console.error(
                    "Failed to fetch complaint categories:",
                    error
                );

                setError(
                    "Failed to load complaint categories."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            className="categoryModal"
            slotProps={{
                paper: {
                    className: "categoryModal_paper",
                },
            }}
        >
            <Box className="categoryModal_header">
                <Box>
                    <Typography className="categoryModal_title">
                        Select Complaint Category
                    </Typography>

                    <Typography className="categoryModal_subtitle">
                        Select the category that best
                        describes your complaint.
                    </Typography>
                </Box>

                <IconButton
                    type="button"
                    className="categoryModal_close"
                    onClick={onClose}
                    aria-label="Close category selection"
                >
                    <CloseOutlined />
                </IconButton>
            </Box>

            <DialogContent className="categoryModal_content">
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 200,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <Box className="categoryModal_grid">
                        {categories.map((category) => {
                            const isSelected =
                                selectedCategory ===
                                category.value;

                            return (
                                <Box
                                    key={category.value}
                                    component="button"
                                    type="button"
                                    className={`categoryModal_card ${isSelected
                                        ? "categoryModal_card--selected"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        onSelect(category)
                                    }>
                                    <Box className="categoryModal_icon">
                                        {category.icon}
                                    </Box>

                                    <Box className="categoryModal_cardText">
                                        <Typography className="categoryModal_name">
                                            {category.name}
                                        </Typography>

                                        <Typography className="categoryModal_urdu">
                                            {category.urduName}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CategoryModal;