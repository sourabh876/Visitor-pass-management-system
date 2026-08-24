const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

const User = require("../models/User");
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");
const Pass = require("../models/Pass");
const CheckLog = require("../models/CheckLog");



// HELPERS


const getDateFilter = (from, to, field = "createdAt") => {

    const filter = {};

    if (from || to) {

        filter[field] = {};

        if (from) {

            const fromDate =
                new Date(from);

            fromDate.setHours(
                0,
                0,
                0,
                0
            );

            filter[field].$gte =
                fromDate;
        }

        if (to) {

            const toDate =
                new Date(to);

            toDate.setHours(
                23,
                59,
                59,
                999
            );

            filter[field].$lte =
                toDate;
        }
    }

    return filter;
};


const sendFileByFormat = async ({
    res,
    format,
    filename,
    headers,
    rows,
    title
}) => {

    // ==================================================
    // CSV
    // ==================================================

    if (format === "csv") {

        const parser =
            new Parser({
                fields: headers
            });

        const csv =
            parser.parse(rows);

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}.csv"`
        );

        return res.send(csv);
    }


    // ==================================================
    // EXCEL
    // ==================================================

    if (
        format === "excel" ||
        format === "xlsx"
    ) {

        const workbook =
            new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet(
                title || "Report"
            );


        worksheet.columns =
            headers.map(
                key => ({
                    header: key,
                    key
                })
            );


        rows.forEach(
            row => {
                worksheet.addRow(row);
            }
        );


        // Header styling

        worksheet.getRow(1).font = {
            bold: true
        };


        worksheet.getRow(1).alignment = {
            vertical: "middle"
        };


        worksheet.columns.forEach(
            column => {

                let maxLength = 12;

                column.eachCell(
                    ({ value }) => {

                        maxLength =
                            Math.max(
                                maxLength,
                                String(
                                    value ?? ""
                                ).length
                            );

                    }
                );

                column.width =
                    Math.min(
                        maxLength + 2,
                        40
                    );

            }
        );


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}.xlsx"`
        );


        await workbook.xlsx.write(
            res
        );

        return res.end();
    }


    // ==================================================
    // PDF
    // ==================================================

    if (format === "pdf") {

        const doc =
            new PDFDocument({
                size: "A4",
                margin: 40
            });


        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}.pdf"`
        );


        doc.pipe(res);


        doc
            .fontSize(20)
            .font("Helvetica-Bold")
            .text(
                title || "Report",
                {
                    align: "center"
                }
            );


        doc.moveDown();


        doc
            .fontSize(9)
            .font("Helvetica");


        rows.forEach(
            (row, index) => {

                doc
                    .font("Helvetica-Bold")
                    .text(
                        `${index + 1}.`
                    );


                headers.forEach(
                    header => {

                        doc
                            .font("Helvetica")
                            .text(
                                `${header}: ${row[header] ?? ""}`
                            );

                    }
                );


                doc.moveDown(0.7);


                if (
                    doc.y >
                    730
                ) {

                    doc.addPage();

                }

            }
        );


        doc.end();

        return;
    }


    return res.status(400).json({

        success: false,

        message:
            "Unsupported export format. Use csv, excel or pdf."

    });

};



// APPOINTMENT REPORT


exports.exportAppointments = async (
    req,
    res
) => {

    try {

        const {
            from,
            to,
            status,
            format = "excel"
        } = req.query;


        const filter = {
            ...getDateFilter(
                from,
                to,
                "createdAt"
            )
        };


        if (status && status !== "All") {

            filter.status =
                status;

        }


        const appointments =
            await Appointment.find(
                filter
            )
            .populate(
                "visitor",
                "fullName email phone company"
            )
            .populate(
                "host",
                "name email department"
            )
            .sort({
                createdAt: -1
            });


        const rows =
            appointments.map(
                appointment => ({

                    ID:
                        appointment._id.toString(),

                    Visitor:
                        appointment.visitor?.fullName ||
                        "N/A",

                    VisitorEmail:
                        appointment.visitor?.email ||
                        "N/A",

                    Host:
                        appointment.hostName ||
                        appointment.host?.name ||
                        "N/A",

                    Department:
                        appointment.department ||
                        appointment.host?.department ||
                        "N/A",

                    Purpose:
                        appointment.purpose ||
                        "N/A",

                    VisitDate:
                        appointment.visitDate
                            ? new Date(
                                appointment.visitDate
                            ).toLocaleDateString()
                            : "N/A",

                    VisitTime:
                        appointment.visitTime ||
                        "N/A",

                    Status:
                        appointment.status,

                    Remarks:
                        appointment.remarks ||
                        "",

                    CreatedAt:
                        appointment.createdAt
                            ? new Date(
                                appointment.createdAt
                            ).toLocaleString()
                            : "N/A"

                })
            );


        return sendFileByFormat({

            res,

            format,

            filename:
                "appointments-report",

            headers: [

                "ID",
                "Visitor",
                "VisitorEmail",
                "Host",
                "Department",
                "Purpose",
                "VisitDate",
                "VisitTime",
                "Status",
                "Remarks",
                "CreatedAt"

            ],

            rows,

            title:
                "Appointments Report"

        });


    } catch (error) {

        console.error(
            "Appointment report error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to export appointment report"

        });

    }

};



// VISITOR REPORT


exports.exportVisitors = async (
    req,
    res
) => {

    try {

        const {
            from,
            to,
            format = "excel"
        } = req.query;


        const filter = {
            ...getDateFilter(
                from,
                to,
                "createdAt"
            )
        };


        const visitors =
            await Visitor.find(
                filter
            )
            .populate(
                "user",
                "email role"
            )
            .sort({
                createdAt: -1
            });


        const rows =
            visitors.map(
                visitor => ({

                    ID:
                        visitor._id.toString(),

                    FullName:
                        visitor.fullName,

                    Email:
                        visitor.email,

                    Phone:
                        visitor.phone ||
                        "",

                    Company:
                        visitor.company ||
                        "",

                    Address:
                        visitor.address ||
                        "",

                    IDProofType:
                        visitor.idProofType ||
                        "",

                    CreatedAt:
                        visitor.createdAt
                            ? new Date(
                                visitor.createdAt
                            ).toLocaleString()
                            : "N/A"

                })
            );


        return sendFileByFormat({

            res,

            format,

            filename:
                "visitors-report",

            headers: [

                "ID",
                "FullName",
                "Email",
                "Phone",
                "Company",
                "Address",
                "IDProofType",
                "CreatedAt"

            ],

            rows,

            title:
                "Visitors Report"

        });


    } catch (error) {

        console.error(
            "Visitor report error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to export visitor report"

        });

    }

};



// PASS REPORT


exports.exportPasses = async (
    req,
    res
) => {

    try {

        const {
            from,
            to,
            status,
            format = "excel"
        } = req.query;


        const filter = {
            ...getDateFilter(
                from,
                to,
                "createdAt"
            )
        };


        if (status && status !== "All") {

            filter.status =
                status;

        }


        const passes =
            await Pass.find(
                filter
            )
            .populate({
                path: "appointment",
                populate: [
                    {
                        path:
                            "visitor",
                        select:
                            "fullName email phone company"
                    },
                    {
                        path:
                            "host",
                        select:
                            "name email department"
                    }
                ]
            })
            .sort({
                createdAt: -1
            });


        const rows =
            passes.map(
                pass => ({

                    ID:
                        pass._id.toString(),

                    PassNumber:
                        pass.passNumber,

                    Visitor:
                        pass.appointment
                            ?.visitor
                            ?.fullName ||
                        "N/A",

                    VisitorEmail:
                        pass.appointment
                            ?.visitor
                            ?.email ||
                        "N/A",

                    Host:
                        pass.appointment
                            ?.hostName ||
                        "N/A",

                    Department:
                        pass.appointment
                            ?.department ||
                        "N/A",

                    VisitDate:
                        pass.appointment
                            ?.visitDate
                            ? new Date(
                                pass.appointment.visitDate
                            ).toLocaleDateString()
                            : "N/A",

                    Status:
                        pass.status,

                    ValidFrom:
                        pass.validFrom
                            ? new Date(
                                pass.validFrom
                            ).toLocaleString()
                            : "N/A",

                    ValidUntil:
                        pass.validUntil
                            ? new Date(
                                pass.validUntil
                            ).toLocaleString()
                            : "N/A",

                    CreatedAt:
                        pass.createdAt
                            ? new Date(
                                pass.createdAt
                            ).toLocaleString()
                            : "N/A"

                })
            );


        return sendFileByFormat({

            res,

            format,

            filename:
                "passes-report",

            headers: [

                "ID",
                "PassNumber",
                "Visitor",
                "VisitorEmail",
                "Host",
                "Department",
                "VisitDate",
                "Status",
                "ValidFrom",
                "ValidUntil",
                "CreatedAt"

            ],

            rows,

            title:
                "Passes Report"

        });


    } catch (error) {

        console.error(
            "Pass report error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to export pass report"

        });

    }

};



// USER REPORT


exports.exportUsers = async (
    req,
    res
) => {

    try {

        const {
            from,
            to,
            format = "excel"
        } = req.query;


        const filter = {
            ...getDateFilter(
                from,
                to,
                "createdAt"
            )
        };


        const users =
            await User.find(
                filter
            )
            .select(
                "name email role department phone isActive createdAt"
            )
            .sort({
                createdAt: -1
            });


        const rows =
            users.map(
                user => ({

                    ID:
                        user._id.toString(),

                    Name:
                        user.name,

                    Email:
                        user.email,

                    Role:
                        user.role,

                    Department:
                        user.department ||
                        "",

                    Phone:
                        user.phone ||
                        "",

                    Active:
                        user.isActive
                            ? "Yes"
                            : "No",

                    CreatedAt:
                        user.createdAt
                            ? new Date(
                                user.createdAt
                            ).toLocaleString()
                            : "N/A"

                })
            );


        return sendFileByFormat({

            res,

            format,

            filename:
                "users-report",

            headers: [

                "ID",
                "Name",
                "Email",
                "Role",
                "Department",
                "Phone",
                "Active",
                "CreatedAt"

            ],

            rows,

            title:
                "Users Report"

        });


    } catch (error) {

        console.error(
            "User report error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to export user report"

        });

    }

};



// CHECK LOG REPORT


exports.exportCheckLogs = async (
    req,
    res
) => {

    try {

        const {
            from,
            to,
            format = "excel"
        } = req.query;


        const filter = {
            ...getDateFilter(
                from,
                to,
                "createdAt"
            )
        };


        const logs =
            await CheckLog.find(
                filter
            )
            .populate({
                path: "pass",
                populate: {
                    path:
                        "appointment",
                    populate: {
                        path:
                            "visitor"
                    }
                }
            })
            .sort({
                createdAt: -1
            });



        const rows =
            logs.map(
                log => ({

                    ID:
                        log._id.toString(),

                    PassNumber:
                        log.pass?.passNumber ||
                        "N/A",

                    Visitor:
                        log.pass
                            ?.appointment
                            ?.visitor
                            ?.fullName ||
                        "N/A",

                    Action:
                        log.action ||
                        log.type ||
                        log.event ||
                        "N/A",

                    CheckIn:
                        log.checkInTime
                            ? new Date(
                                log.checkInTime
                            ).toLocaleString()
                            : "",

                    CheckOut:
                        log.checkOutTime
                            ? new Date(
                                log.checkOutTime
                            ).toLocaleString()
                            : "",

                    CreatedAt:
                        log.createdAt
                            ? new Date(
                                log.createdAt
                            ).toLocaleString()
                            : "N/A"

                })
            );


        return sendFileByFormat({

            res,

            format,

            filename:
                "checklogs-report",

            headers: [

                "ID",
                "PassNumber",
                "Visitor",
                "Action",
                "CheckIn",
                "CheckOut",
                "CreatedAt"

            ],

            rows,

            title:
                "Check Logs Report"

        });


    } catch (error) {

        console.error(
            "Check log report error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to export check log report"

        });

    }

};