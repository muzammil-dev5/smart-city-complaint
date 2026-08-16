import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';

export type ComplaintFormData = {
    title: string,
    description: string,
    category: string,
    address: string
}

type ComplaintFormProps = {
    initialData?: ComplaintFormData;
    onSubmit: (data: ComplaintFormData) => void | Promise<void>;
    submitText?: string;
}
const ComplaintForm = ({
    initialData,
    onSubmit,
    submitText = "Create Complaint"
}: ComplaintFormProps) => {
    const { register,
        handleSubmit,
        reset,
        formState: { errors } } =
        useForm<ComplaintFormData>({ defaultValues: initialData });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset])



    return (
        <div>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    {...register("title",
                        { required: "Title is require" }
                    )}
                    label="Title"
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title?.message} />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    {...register("description",
                        { required: "Description is required" }
                    )}
                    label="Description"
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description?.message} />

                <TextField
                    fullWidth
                    select
                    label="Category"
                    margin="normal"
                    defaultValue=""
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

                <TextField
                    fullWidth
                    {...register("address", {
                        required: "Address is required"
                    })}
                    label="Address"
                    margin="normal"
                    error={!!errors.address}
                    helperText={errors.address?.message} />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}>
                    {submitText}
                </Button>
            </Box>
        </div>
    )
}

export default ComplaintForm