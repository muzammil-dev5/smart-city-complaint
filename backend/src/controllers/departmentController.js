const Department = require("../models/Department");

const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Department name is required"
            });
        }

        const existingDepartment = await Department.findOne({
            name: name.trim()
        });

        if (existingDepartment) {
            return res.status(400).json({
                message: "Department already exists"
            });
        }

        const department = await Department.create({
            name: name.trim(),
            description
        });

        return res.status(201).json({
            message: "Department created successfully",
            department
        });

    } catch (error) {
        console.error("Create department error:", error);

        return res.status(500).json({
            message: "Server error while creating department"
        });
    }
};


const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            departments
        });

    } catch (error) {
        console.error("Get departments error:", error);

        return res.status(500).json({
            message: "Server error while fetching departments"
        });
    }
};


const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        if (name) {
            department.name = name.trim();
        }

        if (description !== undefined) {
            department.description = description;
        }

        if (isActive !== undefined) {
            department.isActive = isActive;
        }

        await department.save();

        return res.status(200).json({
            message: "Department updated successfully",
            department
        });

    } catch (error) {
        console.error("Update department error:", error);

        return res.status(500).json({
            message: "Server error while updating department"
        });
    }
};

const getActiveDepartments = async (req, res) => {
    try {
        const departments = await Department.find({
            isActive: true
        }).sort({
            name: 1
        });

        return res.status(200).json({
            departments
        });

    } catch (error) {
        console.error(
            "Get active departments error:",
            error
        );

        return res.status(500).json({
            message: "Server error while fetching departments"
        });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    getActiveDepartments
};