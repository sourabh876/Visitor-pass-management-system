const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

const Pass = require("../models/Pass");
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");
const {
    notifyUser
} = require("../utils/notificationService");





// CREATE PASS


exports.createPass = async (req, res) => {

    try {

        const {
            appointmentId
        } = req.body;



        // Validate appointment ID


        if (!appointmentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Appointment ID is required"

            });

        }



        // Find appointment


        const appointment =
            await Appointment.findById(
                appointmentId
            );


        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"

            });

        }



        // Appointment must be approved


        if (
            appointment.status !==
            "Approved"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Pass can only be generated for an approved appointment"

            });

        }



        // Check employee authorization


        if (
            req.user.role ===
            "employee"
        ) {

            if (
                appointment.host.toString() !==
                req.user.id.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to generate a pass for this appointment"

                });

            }

        }



        // Check existing pass


        const existingPass =
            await Pass.findOne({

                appointment:
                    appointmentId

            });


        if (existingPass) {

            return res.status(400).json({

                success: false,

                message:
                    "Pass already exists for this appointment",

                data:
                    existingPass

            });

        }



        // Generate pass number


        const randomPart =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();


        const passNumber =
            `VP-${new Date().getFullYear()}-${randomPart}`;



        // Generate QR data


        const qrData =
            JSON.stringify({

                passNumber

            });


        const qrCode =
            await QRCode.toDataURL(
                qrData
            );



        // Pass validity


        const visitDate =
            new Date(
                appointment.visitDate
            );


        const validFrom =
            new Date(visitDate);


        validFrom.setHours(
            0,
            0,
            0,
            0
        );


        const validUntil =
            new Date(visitDate);


        validUntil.setHours(
            23,
            59,
            59,
            999
        );



        // Create pass


        const pass =
            await Pass.create({

                appointment:
                    appointmentId,

                passNumber,

                qrCode,

                status:
                    "Active",

                validFrom,

                validUntil

            });



        // Populate response


        const populatedPass =
            await Pass.findById(
                pass._id
            )
                .populate({

                    path:
                        "appointment",

                    populate: [

                        {
                            path:
                                "visitor",

                            select:
                                "fullName email phone company photo"
                        },

                        {
                            path:
                                "host",

                            select:
                                "name email department"
                        }

                    ]

                });

        const visitor =
            populatedPass?.appointment?.visitor;

        if (visitor) {

            await notifyUser({

                user: {
                    email: visitor.email,
                    phone: visitor.phone
                },

                subject: "Your Visitor Pass is Ready",

                emailHtml: `
            <h2>Visitor Pass Generated</h2>

            <p>
                Your visitor pass has been generated successfully.
            </p>

            <p>
                <strong>Pass Number:</strong>
                ${pass.passNumber}
            </p>

            <p>
                <strong>Host:</strong>
                ${populatedPass.appointment.hostName}
            </p>

            <p>
                <strong>Date:</strong>
                ${new Date(
                    populatedPass.appointment.visitDate
                ).toLocaleDateString()}
            </p>

            <p>
                Please login to the Visitor Pass System
                to view or download your pass.
            </p>
        `,

                smsMessage:
                    `Your visitor pass is ready. ` +
                    `Pass: ${pass.passNumber}. ` +
                    `Visit date: ${new Date(
                        populatedPass.appointment.visitDate
                    ).toLocaleDateString()}.`

            });

        }


        return res.status(201).json({

            success: true,

            message:
                "Visitor pass generated successfully",

            data:
                populatedPass

        });




    } catch (error) {

        console.error(
            "Create pass error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// Get All Passes
exports.getPasses = async (req, res) => {
    try {
        const passes = await Pass.find()
            .populate({
                path: "appointment",
                populate: {
                    path: "visitor"
                }
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: passes.length,
            data: passes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Logged-in Visitor's Passes

exports.getVisitorPasses = async (req, res) => {

    try {


        // Find visitor profile


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



        // Find visitor's appointments


        const appointments =
            await Appointment.find({

                visitor: visitor._id

            }).select("_id");


        const appointmentIds =
            appointments.map(
                appointment =>
                    appointment._id
            );



        // Find passes


        const passes =
            await Pass.find({

                appointment: {
                    $in: appointmentIds
                }

            })
                .populate({

                    path: "appointment",

                    populate: {

                        path: "visitor"

                    }

                })
                .sort({

                    createdAt: -1

                });



        // Response


        return res.status(200).json({

            success: true,

            count: passes.length,

            data: passes

        });


    } catch (error) {

        console.error(
            "Get visitor passes error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// GET PASS BY ID


exports.getPassById = async (req, res) => {

    try {

        const pass =
            await Pass.findById(
                req.params.id
            )
                .populate({

                    path:
                        "appointment",

                    populate: [

                        {

                            path:
                                "visitor",

                            select:
                                "fullName email phone company photo user"

                        },

                        {

                            path:
                                "host",

                            select:
                                "name email department"

                        }

                    ]

                });


        if (!pass) {

            return res.status(404).json({

                success: false,

                message:
                    "Pass not found"

            });

        }



        // Visitor ownership check


        if (
            req.user.role ===
            "visitor"
        ) {

            const passVisitor =
                pass.appointment?.visitor;


            if (!passVisitor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Visitor information not found"

                });

            }


            if (
                passVisitor.user.toString() !==
                req.user.id.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to view this pass"

                });

            }

        }


        return res.status(200).json({

            success: true,

            data:
                pass

        });


    } catch (error) {

        console.error(
            "Get pass by ID error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// GET PASS BY APPOINTMENT ID

exports.getPassByAppointmentId = async (req, res) => {

    try {

        const pass = await Pass.findOne({
            appointment: req.params.appointmentId
        })
            .populate({
                path: "appointment",
                populate: [
                    {
                        path: "visitor",
                        select:
                            "fullName email phone company photo user"
                    },
                    {
                        path: "host",
                        select:
                            "name email department"
                    }
                ]
            });


        if (!pass) {

            return res.status(404).json({

                success: false,

                message:
                    "Pass not found for this appointment"

            });

        }


        // Visitor ownership check

        if (
            req.user.role === "visitor"
        ) {

            const visitor =
                pass.appointment?.visitor;


            if (!visitor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Visitor information not found"

                });

            }


            if (
                visitor.user.toString() !==
                req.user.id.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to view this pass"

                });

            }

        }


        return res.status(200).json({

            success: true,

            data: pass

        });

    } catch (error) {

        console.error(
            "Get pass by appointment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// Get Pass By Pass Number
exports.getPassByNumber = async (req, res) => {
    try {
        const pass = await Pass.findOne({
            passNumber: req.params.passNumber
        })
            .populate({
                path: "appointment",
                populate: {
                    path: "visitor"
                }
            });

        if (!pass) {
            return res.status(404).json({
                success: false,
                message: "Pass not found"
            });
        }

        res.status(200).json({
            success: true,
            data: pass
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.cancelPass = async (req, res) => {

    try {



        const pass =
            await Pass.findById(
                req.params.id
            );


        if (!pass) {

            return res.status(404).json({

                success: false,

                message:
                    "Pass not found"

            });

        }

        if (
            pass.status !==
            "Active"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only active passes can be cancelled"

            });

        }

        pass.status =
            "Cancelled";


        await pass.save();

        const populatedPass =
            await Pass.findById(
                pass._id
            )
                .populate({

                    path:
                        "appointment",

                    populate: {

                        path:
                            "visitor",

                        select:
                            "fullName email phone"

                    }

                });



        const visitor =
            populatedPass
                ?.appointment
                ?.visitor;


        if (visitor) {

            await notifyUser({

                user: {

                    email:
                        visitor.email,

                    phone:
                        visitor.phone

                },

                subject:
                    "Visitor Pass Cancelled",

                emailHtml: `

                    <h2>
                        Visitor Pass Cancelled
                    </h2>

                    <p>
                        Your visitor pass has been cancelled.
                    </p>

                    <p>
                        <strong>
                            Pass Number:
                        </strong>

                        ${pass.passNumber}
                    </p>

                `,

                smsMessage:
                    `Your visitor pass ` +
                    `${pass.passNumber} ` +
                    `has been cancelled.`

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Pass cancelled successfully",

            data:
                populatedPass || pass

        });


    } catch (error) {

        console.error(
            "Cancel pass error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// Generate PDF Visitor Pass
exports.generatePassPDF = async (req, res) => {
    try {
        const pass = await Pass.findById(req.params.id)
            .populate({
                path: "appointment",
                populate: {
                    path: "visitor"
                }
            });

        if (!pass) {
            return res.status(404).json({
                success: false,
                message: "Pass not found"
            });
        }

        const appointment = pass.appointment;
        const visitor = appointment.visitor;

        if (!appointment || !visitor) {
            return res.status(400).json({
                success: false,
                message: "Visitor or appointment information not found"
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${pass.passNumber}.pdf`
        );

        doc.pipe(res);

        // Header
        doc
            .fontSize(24)
            .font("Helvetica-Bold")
            .text(
                "VISITOR PASS",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        doc
            .fontSize(12)
            .font("Helvetica")
            .text(
                "Visitor Pass Management System",
                {
                    align: "center"
                }
            );

        doc.moveDown(2);

        // Pass Number
        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .text(`Pass Number: ${pass.passNumber}`);

        doc.moveDown();

        // Visitor Details
        doc
            .fontSize(16)
            .font("Helvetica-Bold")
            .text("Visitor Details");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .font("Helvetica")
            .text(`Name: ${visitor.fullName}`);

        doc.text(`Phone: ${visitor.phone}`);

        doc.text(
            `Email: ${visitor.email || "N/A"}`
        );

        doc.text(
            `Company: ${visitor.company || "N/A"}`
        );

        doc.moveDown();

        // Appointment Details
        doc
            .fontSize(16)
            .font("Helvetica-Bold")
            .text("Appointment Details");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .font("Helvetica")
            .text(
                `Host: ${appointment.hostName}`
            );

        doc.text(
            `Department: ${appointment.department}`
        );

        doc.text(
            `Purpose: ${appointment.purpose}`
        );

        doc.text(
            `Visit Date: ${new Date(
                appointment.visitDate
            ).toLocaleDateString()}`
        );

        doc.text(
            `Visit Time: ${appointment.visitTime}`
        );

        doc.moveDown();

        // Pass Status
        doc
            .fontSize(16)
            .font("Helvetica-Bold")
            .text("Pass Status");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .font("Helvetica")
            .text(
                `Status: ${pass.status}`
            );

        doc.text(
            `Valid From: ${pass.validFrom.toLocaleString()}`
        );

        doc.text(
            `Valid Until: ${pass.validUntil.toLocaleString()}`
        );

        doc.moveDown(2);

        // QR Code
        doc
            .fontSize(16)
            .font("Helvetica-Bold")
            .text(
                "Scan QR Code",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        const qrBuffer = Buffer.from(
            pass.qrCode.split(",")[1],
            "base64"
        );

        doc.image(
            qrBuffer,
            {
                fit: [180, 180],
                align: "center"
            }
        );

        doc.moveDown();

        doc
            .fontSize(10)
            .font("Helvetica")
            .text(
                "Please present this pass at the security desk.",
                {
                    align: "center"
                }
            );

        doc.moveDown(0.5);

        doc.text(
            "This pass is valid only for the specified visit date.",
            {
                align: "center"
            }
        );

        doc.end();

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};