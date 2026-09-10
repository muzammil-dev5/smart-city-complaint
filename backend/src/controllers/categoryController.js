const Category = require("../models/Category");

// Get all active categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isActive: true
        }).sort({ name: 1 });

        return res.status(200).json({
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);

        return res.status(500).json({
            message: "Server error while fetching categories"
        });
    }
};

module.exports = {
    getCategories
};