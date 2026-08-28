import { Box, Button, MenuItem, TextField } from "@mui/material";
import { DescriptionOutlined, LocationOnOutlined, TitleOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ComplaintFormData>({
        defaultValues: initialData
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const files = Array.from(event.target.files);

        if (files.length > 5) {
            alert("You can upload maximum 5 images.");
            return;
        }
        setSelectedImages(files);
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <Box
            component="form"
            className="complaintForm"
            onSubmit={handleSubmit(onSubmit)}>

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
    <Button
        variant="outlined"
        component="label"
        className="complaintForm_uploadButton"
    >
        Upload Images
        <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleImageChange}
        />
    </Button>

    {selectedImages.length > 0 && (
        <Box className="complaintForm_imageList">
            {selectedImages.map((file, index) => (
                <Box
                    key={`${file.name}-${index}`}
                    className="complaintForm_imageItem"
                >
                    {file.name}
                </Box>
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
                    onClick={() => window.history.back()}>
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