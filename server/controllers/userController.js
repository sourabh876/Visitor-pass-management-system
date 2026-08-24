const User = require("../models/User");
const bcrypt = require("bcryptjs");


  
// CREATE EMPLOYEE / SECURITY USER
// ADMIN ONLY
  

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role,
            phone,
            department
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        if (
            role !== "employee" &&
            role !== "security"
        ) {
            return res.status(400).json({
                success: false,
                message: "Only employee or security users can be created here"
            });
        }

        if (
            role === "employee" &&
            !department
        ) {
            return res.status(400).json({
                success: false,
                message: "Department is required for employee"
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
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
            role,
            phone,
            department
        });

        return res.status(201).json({
            success: true,
            message: `${role} created successfully`,

            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: user.department,
                isActive: user.isActive
            }
        });

    } catch (error) {

        console.error("Create user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};


  
// GET ALL EMPLOYEES
  

const getEmployees = async (req, res) => {
    try {

        const employees = await User.find({
            role: "employee",
            isActive: true
        })
            .select(
                "_id name email phone department"
            )
            .sort({
                name: 1
            });

        return res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });

    } catch (error) {

        console.error("Get employees error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch employees"
        });
    }
};


  
// GET ALL USERS
  

const getUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select(
                "-password"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};


module.exports = {
    createUser,
    getEmployees,
    getUsers
};