const Visitor = require("../models/Visitor");
const User = require("../models/User");


  
// CREATE MY VISITOR PROFILE
  

const createMyProfile = async (req, res) => {
    try {

        const existingVisitor = await Visitor.findOne({
            user: req.user.id
        });

        if (existingVisitor) {
            return res.status(409).json({
                success: false,
                message: "Visitor profile already exists"
            });
        }

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const {
            fullName,
            phone,
            company,
            address,
            idProofType,
            idProofNumber
        } = req.body;

        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });
        }

        const photo = req.file
            ? req.file.path
            : null;

        const visitor = await Visitor.create({
            user: user._id,

            fullName,

            email: user.email,

            phone: phone || user.phone,

            company,

            address,

            idProofType,

            idProofNumber,

            photo,

            createdBy: user._id
        });

        return res.status(201).json({
            success: true,
            message: "Visitor profile created successfully",
            data: visitor
        });

    } catch (error) {

        console.error(
            "Create visitor profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create visitor profile"
        });
    }
};


  
// GET MY PROFILE
  

const getMyProfile = async (req, res) => {
    try {

        const visitor = await Visitor.findOne({
            user: req.user.id,
            isDeleted: false
        })
            .populate(
                "user",
                "name email phone role"
            );

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: visitor
        });

    } catch (error) {

        console.error(
            "Get my profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch visitor profile"
        });
    }
};


  
// UPDATE MY PROFILE
  

const updateMyProfile = async (req, res) => {
    try {

        const visitor = await Visitor.findOne({
            user: req.user.id,
            isDeleted: false
        });

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor profile not found"
            });
        }

        const {
            fullName,
            phone,
            company,
            address,
            idProofType,
            idProofNumber
        } = req.body;

        if (fullName !== undefined) {
            visitor.fullName = fullName;
        }

        if (phone !== undefined) {
            visitor.phone = phone;
        }

        if (company !== undefined) {
            visitor.company = company;
        }

        if (address !== undefined) {
            visitor.address = address;
        }

        if (idProofType !== undefined) {
            visitor.idProofType = idProofType;
        }

        if (idProofNumber !== undefined) {
            visitor.idProofNumber = idProofNumber;
        }

        if (req.file) {
            visitor.photo = req.file.path;
        }

        await visitor.save();

        return res.status(200).json({
            success: true,
            message: "Visitor profile updated successfully",
            data: visitor
        });

    } catch (error) {

        console.error(
            "Update visitor profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update visitor profile"
        });
    }
};


  
// GET ALL VISITORS
  

const getVisitors = async (req, res) => {
    try {

        const visitors = await Visitor.find({
            isDeleted: false
        })
            .populate(
                "user",
                "name email role"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: visitors.length,
            data: visitors
        });

    } catch (error) {

        console.error(
            "Get visitors error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch visitors"
        });
    }
};


  
// GET VISITOR BY ID
  

const getVisitorById = async (req, res) => {
    try {

        const visitor = await Visitor.findOne({
            _id: req.params.id,
            isDeleted: false
        })
            .populate(
                "user",
                "name email role"
            )
            .populate(
                "createdBy",
                "name email"
            );

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: visitor
        });

    } catch (error) {

        console.error(
            "Get visitor error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch visitor"
        });
    }
};


  
// UPDATE VISITOR
// ADMIN
  

const updateVisitor = async (req, res) => {
    try {

        const visitor = await Visitor.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }

        const {
            fullName,
            phone,
            company,
            address,
            idProofType,
            idProofNumber
        } = req.body;

        if (fullName !== undefined) {
            visitor.fullName = fullName;
        }

        if (phone !== undefined) {
            visitor.phone = phone;
        }

        if (company !== undefined) {
            visitor.company = company;
        }

        if (address !== undefined) {
            visitor.address = address;
        }

        if (idProofType !== undefined) {
            visitor.idProofType = idProofType;
        }

        if (idProofNumber !== undefined) {
            visitor.idProofNumber = idProofNumber;
        }

        if (req.file) {
            visitor.photo = req.file.path;
        }

        await visitor.save();

        return res.status(200).json({
            success: true,
            message: "Visitor updated successfully",
            data: visitor
        });

    } catch (error) {

        console.error(
            "Update visitor error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update visitor"
        });
    }
};


  
// SOFT DELETE
// ADMIN
  

const deleteVisitor = async (req, res) => {
    try {

        const visitor = await Visitor.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }

        visitor.isDeleted = true;

        await visitor.save();

        return res.status(200).json({
            success: true,
            message: "Visitor deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete visitor error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete visitor"
        });
    }
};


module.exports = {
    createMyProfile,
    getMyProfile,
    updateMyProfile,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor
};