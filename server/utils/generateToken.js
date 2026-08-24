const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
    console.log(process.env.JWT_SECRET);
    return  jwt.sign(
        {
            id: userId,
            role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '7d',
        }
    )
}

module.exports = generateToken;