const CheckLog = require("../models/CheckLog");
const Pass = require("../models/Pass");


// Check In Visitor
exports.checkInVisitor = async (req, res) => {
    try {
        const { passNumber } = req.body;

        if (!passNumber) {
            return res.status(400).json({
                success: false,
                message: "Pass number is required"
            });
        }

        // Find pass
        const pass = await Pass.findOne({
            passNumber: passNumber
        }).populate({
            path: "appointment",
            populate: {
                path: "visitor"
            }
        });

        if (!pass) {
            return res.status(404).json({
                success: false,
                message: "Invalid visitor pass"
            });
        }

        // Check pass status
        if (pass.status !== "Active") {
            return res.status(400).json({
                success: false,
                message: `Pass is ${pass.status}`
            });
        }

        // Check pass validity
        const now = new Date();

        if (now < pass.validFrom || now > pass.validUntil) {
            return res.status(400).json({
                success: false,
                message: "Visitor pass has expired or is not valid"
            });
        }

        // Check if visitor is already inside
        const existingCheckLog = await CheckLog.findOne({
            pass: pass._id,
            status: "Inside"
        });

        if (existingCheckLog) {
            return res.status(400).json({
                success: false,
                message: "Visitor is already checked in",
                data: existingCheckLog
            });
        }

        // Get visitor
        const visitor = pass.appointment.visitor;

        // Create check log
        const checkLog = await CheckLog.create({
            pass: pass._id,
            visitor: visitor._id,
            securityUser: req.user.id,
            checkInTime: new Date(),
            status: "Inside"
        });
 

        // Return response
        res.status(201).json({
            success: true,
            message: "Visitor checked in successfully",
            data: {
                checkLog,
                visitor: {
                    id: visitor._id,
                    name: visitor.fullName,
                    phone: visitor.phone,
                    company: visitor.company
                },
                pass: {
                    id: pass._id,
                    passNumber: pass.passNumber,
                    status: pass.status
                }
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Check Out Visitor
exports.checkOutVisitor = async (req, res) => {
    try {
        const { passNumber } = req.body;

        if (!passNumber) {
            return res.status(400).json({
                success: false,
                message: "Pass number is required"
            });
        }

        // Find pass
        const pass = await Pass.findOne({
            passNumber: passNumber
        });

        if (!pass) {
            return res.status(404).json({
                success: false,
                message: "Pass not found"
            });
        }

        // Find active check-in
        const checkLog = await CheckLog.findOne({
            pass: pass._id,
            status: "Inside"
        });

        if (!checkLog) {
            return res.status(400).json({
                success: false,
                message: "Visitor is not currently checked in"
            });
        }

        // Checkout
        checkLog.checkOutTime = new Date();

        checkLog.status = "Checked-Out";

        await checkLog.save();

        // Update pass
        pass.status = "Used";

        await pass.save();

        res.status(200).json({
            success: true,
            message: "Visitor checked out successfully",
            data: checkLog
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Check Logs
exports.getCheckLogs = async (req, res) => {
    try {
        const logs = await CheckLog.find()
            .populate(
                "visitor",
                "fullName email phone company photo"
            )
            .populate(
                "securityUser",
                "name email role"
            )
            .populate(
                "pass",
                "passNumber status"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Currently Inside Visitors
exports.getVisitorsInside = async (req, res) => {
    try {
        const logs = await CheckLog.find({
            status: "Inside"
        })
            .populate(
                "visitor",
                "fullName email phone company photo"
            )
            .populate(
                "securityUser",
                "name email role"
            )
            .populate(
                "pass",
                "passNumber status"
            )
            .sort({
                checkInTime: -1
            });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};