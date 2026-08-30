import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import {
    DescriptionOutlined,
    LocationOnOutlined,
    TitleOutlined
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import "./ComplaintForm.scss";

export type ComplaintFormData = {
    title: string;
    description: string;
    category: string;
    address: string;
    images?: File[];
    existingImages?: string[];
    location?: {
        latitude: number;
        longitude: number;
    };
};

type ComplaintFormProps = {
    initialData?: ComplaintFormData;
    onSubmit: (
        data: ComplaintFormData
    ) => void | Promise<void>;
    submitText?: string;
};

const ComplaintForm = ({
    initialData,
    onSubmit,
    submitText = "Create Complaint"
}: ComplaintFormProps) => {
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [location, setLocation] = useState({ latitude: 24.8607, longitude: 67.0011 });
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ComplaintFormData>({
        defaultValues: initialData
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
            setImages([]);
            setExistingImages(
                initialData.existingImages || []
            );
        }
    }, [initialData, reset]);

    const handleRemoveExistingImage = (image: string) => {
        setExistingImages((prev) =>
            prev.filter((item) => item !== image)
        );
    };

    const handleFormSubmit = (data: ComplaintFormData) => {
        const formData: ComplaintFormData = {
            ...data,
            images,
            existingImages,
            location
        };
        onSubmit(formData);
    };

    const searchAddress = async () => {
        const address = document.querySelector(
            'input[name="address"]'
        ) as HTMLInputElement | null;

        if (!address?.value.trim()) {
            return;
        }

        try {
            setIsSearching(true);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                new URLSearchParams({
                    q: address.value,
                    format: "jsonv2",
                    limit: "1",
                    countrycodes: "pk"
                }),
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const results = await response.json();

            if (!results.length) {
                alert("Location not found. Please enter a more specific address.");
                return;
            }

            const result = results[0];

            const latitude = Number(result.lat);
            const longitude = Number(result.lon);

            setLocation({
                latitude,
                longitude
            });

        } catch (error) {
            console.error("Address search error:", error);
            alert("Unable to search location.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Box
            component="form"
            className="complaintForm"
            onSubmit={handleSubmit(handleFormSubmit)}>

            <Box className="complaintForm_field">
                <TextField
                    fullWidth
                    {...register("title", {
                        required: "Title is required"
                    })}
                    label="Complaint Title"
                    placeholder="Enter complaint title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <TitleOutlined className="complaintForm_icon" />
                            ),
                        },
                    }}
                />
            </Box>

            <Box className="complaintForm_field">
                <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    {...register("description", {
                        required: "Description is required"
                    })}
                    label="Description"
                    placeholder="Describe the issue in detail..."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <DescriptionOutlined className="complaintForm_icon complaintForm_descriptionIcon" />
                            ),
                        },
                    }}
                />
            </Box>

            <Box className="complaintForm_grid">
                <Box className="complaintForm_field">
                    <TextField
                        fullWidth
                        select
                        label="Category"
                        defaultValue={initialData?.category || ""}
                        {...register("category", {
                            required: "Category is required"
                        })}
                        error={!!errors.category}
                        helperText={errors.category?.message}>
                        <MenuItem value="road_damage">
                            Road Damage
                        </MenuItem>

                        <MenuItem value="street_light">
                            Street Light Issues
                        </MenuItem>

                        <MenuItem value="garbage_collection">
                            Garbage Collection
                        </MenuItem>
                    </TextField>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start"
                    }}>
                    <TextField
                        fullWidth
                        {...register("address", {
                            required: "Address is required"
                        })}
                        label="Address"
                        placeholder="e.g. Gulshan-e-Iqbal, Karachi"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <LocationOnOutlined className="complaintForm_icon" />
                                )
                            }
                        }}
                    />

                    <Button
                        type="button"
                        variant="contained"
                        onClick={searchAddress}
                        disabled={isSearching}
                        sx={{
                            minWidth: "110px",
                            height: "56px"
                        }}
                        startIcon={
                            isSearching
                                ? <CircularProgress size={18} color="inherit" />
                                : <SearchIcon />
                        }
                    >
                        {isSearching ? "Searching" : "Search"}
                    </Button>
                </Box>
                <Box className="complaintForm_field">
                    <LocationPicker
                        value={location}
                        onChange={setLocation}
                    />
                </Box>

                <Box className="complaintForm_field">
                    <TextField
                        fullWidth
                        type="file"
                        slotProps={{
                            htmlInput: {
                                accept: "image/jpeg,image/png,image/webp",
                                multiple: true
                            }
                        }}
                        onChange={(event) => {
                            const files = Array.from(
                                (event.target as HTMLInputElement).files || []
                            );

                            if (files.length > 5) {
                                console.warn("Maximum 5 images are allowed.");
                                setImages(files.slice(0, 5));
                                return;
                            }

                            setImages(files);
                        }}
                    />

                    {existingImages.length > 0 && (
                        <Box sx={{ mt: 2 }}>

                            <Typography sx={{ mb: 1 }}>
                                Existing Images
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1.5,
                                    flexWrap: "wrap"
                                }}
                            >
                                {existingImages.map(
                                    (image, index) => (
                                        <Box
                                            key={image}
                                            sx={{
                                                position:
                                                    "relative",
                                                width: 90,
                                                height: 90,
                                                borderRadius: 1,
                                                overflow:
                                                    "hidden",
                                                border:
                                                    "1px solid #d1fae5"
                                            }}
                                        >

                                            <img
                                                src={image}
                                                alt={`Complaint image ${index + 1}`}
                                                style={{
                                                    width:
                                                        "100%",
                                                    height:
                                                        "100%",
                                                    objectFit:
                                                        "cover"
                                                }}
                                            />

                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveExistingImage(
                                                        image
                                                    )
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    top: 4,
                                                    right: 4,
                                                    minWidth:
                                                        24,
                                                    width: 24,
                                                    height: 24,
                                                    padding: 0,
                                                    borderRadius:
                                                        "50%",
                                                    backgroundColor:
                                                        "rgba(0,0,0,0.65)",
                                                    color:
                                                        "#fff",
                                                    fontSize:
                                                        16,
                                                    lineHeight:
                                                        1,
                                                    "&:hover":
                                                    {
                                                        backgroundColor:
                                                            "rgba(220,38,38,0.9)"
                                                    }
                                                }}
                                            >
                                                ×
                                            </Button>

                                        </Box>
                                    )
                                )}
                            </Box>
                        </Box>
                    )}

                    {images.length > 0 && (
                        <Box sx={{ mt: 2 }}>

                            <Typography sx={{ mb: 1 }}>
                                New Images
                            </Typography>

                            {images.map(
                                (image, index) => (
                                    <div
                                        key={`${image.name}-${index}`}
                                    >
                                        {image.name}
                                    </div>
                                ))}
                        </Box>
                    )}
                </Box>
            </Box>

            <Box className="complaintForm_actions">
                <Button
                    type="button"
                    variant="outlined"
                    className="complaintForm_cancelButton"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    className="complaintForm_submitButton">
                    {submitText}
                </Button>
            </Box>
        </Box>
    );
};

export default ComplaintForm;