import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";

import {
    CameraAltOutlined,
    DeleteOutlineSharp,
    DescriptionOutlined,
    LocationOnOutlined,
    TitleOutlined,
    SearchOutlined,
    CloudUploadOutlined,
    MyLocationOutlined,
    CheckCircleOutlineRounded,
    CategoryOutlined,
} from "@mui/icons-material";

import CircularProgress from "@mui/material/CircularProgress";

import { useState } from "react";
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

const MAX_IMAGES = 5;

const DEFAULT_LOCATION = {
    latitude: 24.8607,
    longitude: 67.0011,
};

const ComplaintForm = ({
    initialData,
    onSubmit,
    submitText = "Create Complaint",
}: ComplaintFormProps) => {
    const navigate = useNavigate();

    const [images, setImages] = useState<File[]>([]);

    const [existingImages, setExistingImages] =
        useState<string[]>(
            initialData?.existingImages || []
        );

    const [location, setLocation] = useState(
        initialData?.location || DEFAULT_LOCATION
    );

    const [isSearching, setIsSearching] =
        useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ComplaintFormData>({
        defaultValues: initialData,
    });

    const totalImages =
        images.length + existingImages.length;

    const addImages = (selectedFiles: File[]) => {
        if (!selectedFiles.length) {
            return;
        }

        setImages((previousImages) => {
            const remainingSlots =
                MAX_IMAGES - totalImages;

            if (remainingSlots <= 0) {
                alert(
                    `Maximum ${MAX_IMAGES} images are allowed.`
                );

                return previousImages;
            }

            const newImages = selectedFiles.slice(
                0,
                remainingSlots
            );

            if (
                selectedFiles.length >
                remainingSlots
            ) {
                alert(
                    `You can upload maximum ${MAX_IMAGES} images.`
                );
            }

            return [
                ...previousImages,
                ...newImages,
            ];
        });
    };

    const handleRemoveImage = (
        index: number
    ) => {
        setImages((previousImages) =>
            previousImages.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            )
        );
    };

    const handleRemoveExistingImage = (
        image: string
    ) => {
        setExistingImages((previousImages) =>
            previousImages.filter(
                (item) => item !== image
            )
        );
    };

    const handleMapLocationChange = async (
        newLocation: {
            latitude: number;
            longitude: number;
        }
    ) => {
        setLocation(newLocation);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?${new URLSearchParams(
                    {
                        lat: newLocation.latitude.toString(),
                        lon: newLocation.longitude.toString(),
                        format: "jsonv2",
                        zoom: "18",
                        addressdetails: "1",
                    }
                )}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Reverse geocoding failed"
                );
            }

            const result =
                await response.json();

            if (result.display_name) {
                setValue(
                    "address",
                    result.display_name,
                    {
                        shouldValidate: true,
                        shouldDirty: true,
                    }
                );
            }
        } catch (error) {
            console.error(
                "Reverse geocoding error:",
                error
            );
        }
    };

    const searchAddress = async () => {
        const addressInput =
            document.querySelector(
                'input[name="address"]'
            ) as HTMLInputElement | null;

        if (!addressInput?.value.trim()) {
            return;
        }

        try {
            setIsSearching(true);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
                    {
                        q: addressInput.value,
                        format: "jsonv2",
                        limit: "1",
                        countrycodes: "pk",
                    }
                )}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Address search failed"
                );
            }

            const results =
                await response.json();

            if (!results.length) {
                alert(
                    "Location not found. Please enter a more specific address."
                );

                return;
            }

            const result = results[0];

            const newLocation = {
                latitude: Number(result.lat),
                longitude: Number(result.lon),
            };

            setLocation(newLocation);

            setValue(
                "address",
                addressInput.value,
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );
        } catch (error) {
            console.error(
                "Address search error:",
                error
            );

            alert(
                "Unable to search location."
            );
        } finally {
            setIsSearching(false);
        }
    };

    const handleFormSubmit = (
        data: ComplaintFormData
    ) => {
        const formData: ComplaintFormData = {
            ...data,
            images,
            existingImages,
            location,
        };

        onSubmit(formData);
    };

    return (
        <Box
            component="form"
            className="complaintForm"
            onSubmit={handleSubmit(
                handleFormSubmit
            )}
        >
            {/* =====================================
                FORM HEADING
            ====================================== */}

            <Box className="complaintForm_heading">
                <Box className="complaintForm_headingIcon">
                    <DescriptionOutlined />
                </Box>

                <Box>
                    <Typography className="complaintForm_headingTitle">
                        Complaint Information
                    </Typography>

                    <Typography className="complaintForm_headingText">
                        Provide accurate details about
                        the issue to help us resolve it
                        quickly.
                    </Typography>
                </Box>
            </Box>

            {/* =====================================
                MAIN FORM CARD
            ====================================== */}

            <Box className="complaintForm_card">
                {/* CARD HEADER */}

                <Box className="complaintForm_cardHeader">
                    <Box>
                        <Typography className="complaintForm_cardTitle">
                            Complaint Details
                        </Typography>

                        <Typography className="complaintForm_cardSubtitle">
                            Tell us what happened and
                            where the issue is located.
                        </Typography>
                    </Box>

                    <Box className="complaintForm_required">
                        <span>*</span> Required fields
                    </Box>
                </Box>

                {/* =================================
                    60 / 40 CONTENT
                ================================== */}

                <Box className="complaintForm_content">
                    {/* =================================
                        LEFT COLUMN — 60%
                    ================================== */}

                    <Box className="complaintForm_left">
                        {/* TITLE */}

                        <Box className="complaintForm_field">
                            <Typography className="complaintForm_label">
                                <TitleOutlined />
                                Complaint Title
                                <span>*</span>
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="e.g. Damaged road near Main Boulevard"
                                {...register(
                                    "title",
                                    {
                                        required:
                                            "Complaint title is required",
                                    }
                                )}
                                error={
                                    !!errors.title
                                }
                                helperText={
                                    errors.title
                                        ?.message
                                }
                            />
                        </Box>

                        {/* DESCRIPTION */}

                        <Box className="complaintForm_field">
                            <Typography className="complaintForm_label">
                                <DescriptionOutlined />
                                Description
                                <span>*</span>
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                minRows={6}
                                placeholder="Describe the issue in detail. Mention nearby landmarks or any information that may help the department..."
                                {...register(
                                    "description",
                                    {
                                        required:
                                            "Complaint description is required",
                                    }
                                )}
                                error={
                                    !!errors.description
                                }
                                helperText={
                                    errors
                                        .description
                                        ?.message
                                }
                            />
                        </Box>

                        {/* CATEGORY */}

                        <Box className="complaintForm_field">
                            <Typography className="complaintForm_label">
                                <CategoryOutlined />
                                Complaint Category
                                <span>*</span>
                            </Typography>

                            <TextField
                                select
                                fullWidth
                                defaultValue={
                                    initialData?.category ||
                                    ""
                                }
                                {...register(
                                    "category",
                                    {
                                        required:
                                            "Complaint category is required",
                                    }
                                )}
                                error={
                                    !!errors.category
                                }
                                helperText={
                                    errors.category
                                        ?.message
                                }
                            >
                                <MenuItem value="">
                                    Select complaint
                                    category
                                </MenuItem>

                                <MenuItem value="road_damage">
                                    🚧 Road Damage
                                </MenuItem>

                                <MenuItem value="street_light">
                                    💡 Street Light Issue
                                </MenuItem>

                                <MenuItem value="garbage_collection">
                                    🗑️ Garbage Collection
                                </MenuItem>
                            </TextField>
                        </Box>

                        {/* ADDRESS */}

                        <Box className="complaintForm_field">
                            <Typography className="complaintForm_label">
                                <LocationOnOutlined />
                                Complaint Address
                                <span>*</span>
                            </Typography>

                            <Box className="complaintForm_address">
                                <TextField
                                    fullWidth
                                    placeholder="Enter street, area or nearby landmark"
                                    {...register(
                                        "address",
                                        {
                                            required:
                                                "Address is required",
                                        }
                                    )}
                                    error={
                                        !!errors.address
                                    }
                                    helperText={
                                        errors
                                            .address
                                            ?.message
                                    }
                                />

                                <Button
                                    type="button"
                                    className="complaintForm_searchButton"
                                    variant="contained"
                                    onClick={
                                        searchAddress
                                    }
                                    disabled={
                                        isSearching
                                    }
                                    startIcon={
                                        isSearching ? (
                                            <CircularProgress
                                                size={
                                                    17
                                                }
                                                color="inherit"
                                            />
                                        ) : (
                                            <SearchOutlined />
                                        )
                                    }
                                >
                                    {isSearching
                                        ? "Searching"
                                        : "Find Location"}
                                </Button>
                            </Box>
                        </Box>

                        {/* LEFT COLUMN HELPER */}

                        <Box className="complaintForm_leftHelper">
                            <CheckCircleOutlineRounded />

                            <Typography>
                                Make sure the complaint
                                details are accurate
                                before submitting.
                            </Typography>
                        </Box>
                    </Box>

                    {/* =================================
                        RIGHT COLUMN — 40%
                    ================================== */}

                    <Box className="complaintForm_right">
                        {/* MAP */}

                        <Box className="complaintForm_mapCard">
                            <Box className="complaintForm_mapHeader">
                                <Box>
                                    <Typography className="complaintForm_mapTitle">
                                        Complaint Location
                                    </Typography>

                                    <Typography className="complaintForm_mapSubtitle">
                                        Pin the exact
                                        location of the
                                        issue.
                                    </Typography>
                                </Box>

                                <Box className="complaintForm_mapBadge">
                                    <MyLocationOutlined />
                                    Map Ready
                                </Box>
                            </Box>

                            <Box className="complaintForm_map">
                                <LocationPicker
                                    value={location}
                                    onChange={
                                        handleMapLocationChange
                                    }
                                />
                            </Box>

                            <Box className="complaintForm_coordinates">
                                <Box>
                                    <span>
                                        Latitude
                                    </span>

                                    <strong>
                                        {location.latitude.toFixed(
                                            6
                                        )}
                                    </strong>
                                </Box>

                                <Box>
                                    <span>
                                        Longitude
                                    </span>

                                    <strong>
                                        {location.longitude.toFixed(
                                            6
                                        )}
                                    </strong>
                                </Box>
                            </Box>
                        </Box>

                        {/* IMAGE UPLOAD */}

                        <Box className="complaintForm_imageCard">
                            <Box className="complaintForm_imageHeader">
                                <Box>
                                    <Typography className="complaintForm_imageTitle">
                                        Complaint Images
                                    </Typography>

                                    <Typography className="complaintForm_imageSubtitle">
                                        Add photos as
                                        evidence.
                                    </Typography>
                                </Box>

                                <Box className="complaintForm_imageCount">
                                    {totalImages}/
                                    {MAX_IMAGES}
                                </Box>
                            </Box>

                            <Box className="complaintForm_upload">
                                <Box className="complaintForm_uploadIcon">
                                    <CloudUploadOutlined />
                                </Box>

                                <Typography className="complaintForm_uploadTitle">
                                    Upload evidence
                                </Typography>

                                <Typography className="complaintForm_uploadText">
                                    Take a photo or
                                    choose from your
                                    gallery
                                </Typography>

                                <Box className="complaintForm_uploadButtons">
                                    <Button
                                        component="label"
                                        className="complaintForm_cameraButton"
                                        variant="contained"
                                        startIcon={
                                            <CameraAltOutlined />
                                        }
                                        disabled={
                                            totalImages >=
                                            MAX_IMAGES
                                        }
                                    >
                                        Camera

                                        <input
                                            hidden
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={(
                                                event
                                            ) => {
                                                const files =
                                                    Array.from(
                                                        event
                                                            .target
                                                            .files ||
                                                        []
                                                    );

                                                addImages(
                                                    files
                                                );

                                                event.target.value =
                                                    "";
                                            }}
                                        />
                                    </Button>

                                    <Button
                                        component="label"
                                        className="complaintForm_galleryButton"
                                        variant="outlined"
                                        startIcon={
                                            <CloudUploadOutlined />
                                        }
                                        disabled={
                                            totalImages >=
                                            MAX_IMAGES
                                        }
                                    >
                                        Gallery

                                        <input
                                            hidden
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            onChange={(
                                                event
                                            ) => {
                                                const files =
                                                    Array.from(
                                                        event
                                                            .target
                                                            .files ||
                                                        []
                                                    );

                                                addImages(
                                                    files
                                                );

                                                event.target.value =
                                                    "";
                                            }}
                                        />
                                    </Button>
                                </Box>

                                <Typography className="complaintForm_uploadHint">
                                    JPG, PNG or WEBP •
                                    Maximum{" "}
                                    {MAX_IMAGES}{" "}
                                    images
                                </Typography>
                            </Box>

                            {/* EXISTING IMAGES */}

                            {existingImages.length >
                                0 && (
                                <Box className="complaintForm_previewSection">
                                    <Typography className="complaintForm_previewTitle">
                                        Existing Images
                                    </Typography>

                                    <Box className="complaintForm_imageGrid">
                                        {existingImages.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <Box
                                                    key={`${image}-${index}`}
                                                    className="complaintForm_preview"
                                                >
                                                    <Box
                                                        component="img"
                                                        src={
                                                            image
                                                        }
                                                        alt={`Existing complaint image ${
                                                            index +
                                                            1
                                                        }`}
                                                    />

                                                    <IconButton
                                                        type="button"
                                                        className="complaintForm_deleteButton"
                                                        onClick={() =>
                                                            handleRemoveExistingImage(
                                                                image
                                                            )
                                                        }
                                                    >
                                                        <DeleteOutlineSharp />
                                                    </IconButton>

                                                    <span>
                                                        Existing
                                                    </span>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            )}

                            {/* NEW IMAGES */}

                            {images.length > 0 && (
                                <Box className="complaintForm_previewSection">
                                    <Typography className="complaintForm_previewTitle">
                                        New Images
                                    </Typography>

                                    <Box className="complaintForm_imageGrid">
                                        {images.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <Box
                                                    key={`${image.name}-${image.lastModified}-${index}`}
                                                    className="complaintForm_preview"
                                                >
                                                    <Box
                                                        component="img"
                                                        src={URL.createObjectURL(
                                                            image
                                                        )}
                                                        alt={`Selected complaint image ${
                                                            index +
                                                            1
                                                        }`}
                                                    />

                                                    <IconButton
                                                        type="button"
                                                        className="complaintForm_deleteButton"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <DeleteOutlineSharp />
                                                    </IconButton>

                                                    <span>
                                                        New
                                                        Photo
                                                    </span>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* =================================
                    FORM FOOTER
                ================================== */}

                <Box className="complaintForm_footer">
                    <Box className="complaintForm_footerInfo">
                        <CheckCircleOutlineRounded />

                        <Typography>
                            Review your information
                            before submitting your
                            complaint.
                        </Typography>
                    </Box>

                    <Box className="complaintForm_actions">
                        <Button
                            type="button"
                            className="complaintForm_cancelButton"
                            variant="outlined"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="complaintForm_submitButton"
                            variant="contained"
                        >
                            {submitText}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ComplaintForm;