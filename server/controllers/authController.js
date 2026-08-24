const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone
        } = req.body;

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "visitor"
        });

        const token = generateToken(user._id, user.role);

        return res.status(201).json({
            success: true,
            message: "Visitor registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};


exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email don't exists"
            })
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(404).json({
                success: false,
                message: "Incorrect password"
            })
        }


        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token,
            user,
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}