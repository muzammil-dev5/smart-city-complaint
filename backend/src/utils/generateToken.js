const jwt = require("jsonwebtoken");

const generateToken = (userId, role, department) => {
    return jwt.sign(
        {
            id: userId,
            role: role,
            department: department
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

module.exports = generateToken;