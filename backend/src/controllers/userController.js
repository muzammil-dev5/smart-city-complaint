const User = require("../models/User");

const getOfficers = async (req, res) => {
    try {
        const officers = await User.find({
            role: "officer"
        }).select("_id name email");

        return res.status(200).json({
            officers
        });

    } catch (error) {
        console.error("Get officers error:", error);

        return res.status(500).json({
            message: "Server error while fetching officers"
        });
    }
};

module.exports = {
    getOfficers
};