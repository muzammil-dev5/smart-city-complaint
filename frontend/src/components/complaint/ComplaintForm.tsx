import { Box, Button, MenuItem, TextField } from "@mui/material";
import { DescriptionOutlined, LocationOnOutlined, TitleOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./ComplaintForm.scss";

export type ComplaintFormData = {
    title: string;
    description: string;
    category: string;
    address: string;
    images?: File[];
};

type ComplaintFormProps = {
    initialData?: ComplaintFormData;
    onSubmit: (
        data: ComplaintFormData
    ) => void | Promise<void>;
    submitText?: string;
};

const ComplaintForm = ({ initialData, onSubmit, submitText = "Create Complaint" }: ComplaintFormProps) => {
    const [images, setImages] = useState<File[]>([]);
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
            setImages(initialData.images || []);
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: ComplaintFormData) => {
        const formData: ComplaintFormData = {
            ...data,
            images
        };
        onSubmit(formData);
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

                <Box className="complaintForm_field">
                    <TextField
                        fullWidth
                        {...register("address", {
                            required: "Address is required"
                        })}
                        label="Address"
                        placeholder="Enter issue location"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <LocationOnOutlined className="complaintForm_icon" />
                                ),
                            },
                        }}
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
                            console.log("SELECTED FILES:", files);
                        }}
                    />

                    {images.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                            {images.map((image, index) => (
                                <div key={index}>
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