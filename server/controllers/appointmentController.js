const Appointment = require("../models/Appointment");
const Visitor = require("../models/Visitor");
const User = require("../models/User");
const {
  notifyUser
} = require("../utils/notificationService");


// CREATE APPOINTMENT
// VISITOR


const createAppointment = async (req, res) => {
  try {

    const {
      host,
      purpose,
      visitDate,
      visitTime
    } = req.body;


    // -------------------------------
    // Validate request
    // -------------------------------

    if (
      !host ||
      !purpose ||
      !visitDate ||
      !visitTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Host, purpose, visit date and visit time are required"
      });
    }


    // -------------------------------
    // Find logged-in visitor
    // -------------------------------

    const visitor = await Visitor.findOne({
      user: req.user.id,
      isDeleted: false
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor profile not found. Please complete your profile first."
      });
    }


    // -------------------------------
    // Find employee
    // -------------------------------

    const employee = await User.findOne({
      _id: host,
      role: "employee",
      isActive: true
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Selected employee was not found"
      });
    }


    // -------------------------------
    // Validate date
    // -------------------------------

    const appointmentDate = new Date(
      visitDate
    );

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit date"
      });
    }


    // -------------------------------
    // Prevent past date
    // -------------------------------

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    appointmentDate.setHours(
      0,
      0,
      0,
      0
    );

    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: "Visit date cannot be in the past"
      });
    }


    // -------------------------------
    // Create appointment
    // -------------------------------

    const appointment = await Appointment.create({

      visitor: visitor._id,

      host: employee._id,

      hostName: employee.name,

      department:
        employee.department || "Not Assigned",

      purpose,

      visitDate: appointmentDate,

      visitTime,

      status: "Pending"
    });


    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate(
          "visitor",
          "fullName email phone company photo"
        )
        .populate(
          "host",
          "name email department"
        );

    await notifyUser({

      user: employee,

      subject:
        "New Visitor Appointment Request",

      emailHtml: `

        <h2>
            New Appointment Request
        </h2>

        <p>
            You have received a new visitor appointment request.
        </p>

        <p>
            <strong>Visitor:</strong>
            ${visitor.fullName}
        </p>

        <p>
            <strong>Date:</strong>
            ${appointmentDate.toLocaleDateString()}
        </p>

        <p>
            <strong>Time:</strong>
            ${visitTime}
        </p>

        <p>
            Please login to the Visitor Pass System
            to review the appointment.
        </p>

    `,

      smsMessage:
        `New visitor appointment from ${visitor.fullName}. ` +
        `Date: ${appointmentDate.toLocaleDateString()} ` +
        `Time: ${visitTime}. Please review it.`

    });


    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: populatedAppointment
    });



  } catch (error) {

    console.error(
      "Create appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment"
    });
  }
};



// GET MY APPOINTMENTS
// VISITOR


const getMyAppointments = async (req, res) => {
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

    const appointments =
      await Appointment.find({
        visitor: visitor._id,
        isDeleted: false
      })
        .populate(
          "host",
          "name email department"
        )
        .populate(
          "approvedBy",
          "name email role"
        )
        .sort({
          createdAt: -1
        });


    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {

    console.error(
      "Get my appointments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments"
    });
  }
};



// GET EMPLOYEE APPOINTMENTS
// EMPLOYEE


const getMyEmployeeAppointments = async (
  req,
  res
) => {
  try {

    const appointments =
      await Appointment.find({
        host: req.user.id,
        isDeleted: false
      })
        .populate(
          "visitor",
          "fullName email phone company photo"
        )
        .populate(
          "host",
          "name email department"
        )
        .populate(
          "approvedBy",
          "name email role"
        )
        .sort({
          visitDate: 1,
          visitTime: 1
        });


    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {

    console.error(
      "Get employee appointments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments"
    });
  }
};



// GET ALL APPOINTMENTS
// ADMIN


const getAllAppointments = async (
  req,
  res
) => {
  try {

    const appointments =
      await Appointment.find({
        isDeleted: false
      })
        .populate(
          "visitor",
          "fullName email phone company photo"
        )
        .populate(
          "host",
          "name email department"
        )
        .populate(
          "approvedBy",
          "name email role"
        )
        .sort({
          createdAt: -1
        });


    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {

    console.error(
      "Get all appointments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments"
    });
  }
};



// GET APPOINTMENT BY ID


const getAppointmentById = async (
  req,
  res
) => {
  try {

    const appointment =
      await Appointment.findOne({
        _id: req.params.id,
        isDeleted: false
      })
        .populate(
          "visitor",
          "fullName email phone company photo"
        )
        .populate(
          "host",
          "name email department"
        )
        .populate(
          "approvedBy",
          "name email role"
        );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }


    return res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {

    console.error(
      "Get appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment"
    });
  }
};



// UPDATE APPOINTMENT


const updateAppointment = async (
  req,
  res
) => {
  try {

    const appointment =
      await Appointment.findOne({
        _id: req.params.id,
        isDeleted: false
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }


    if (
      appointment.status !== "Pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only pending appointments can be updated"
      });
    }


    const {
      host,
      purpose,
      visitDate,
      visitTime
    } = req.body;


    if (host) {

      const employee =
        await User.findOne({
          _id: host,
          role: "employee",
          isActive: true
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found"
        });
      }

      appointment.host =
        employee._id;

      appointment.hostName =
        employee.name;

      appointment.department =
        employee.department ||
        "Not Assigned";
    }


    if (purpose !== undefined) {
      appointment.purpose =
        purpose;
    }


    if (visitDate !== undefined) {

      const newDate =
        new Date(visitDate);

      if (
        Number.isNaN(
          newDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid visit date"
        });
      }

      appointment.visitDate =
        newDate;
    }


    if (visitTime !== undefined) {
      appointment.visitTime =
        visitTime;
    }


    await appointment.save();


    const updatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate(
          "visitor",
          "fullName email phone company"
        )
        .populate(
          "host",
          "name email department"
        );


    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment
    });

  } catch (error) {

    console.error(
      "Update appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment"
    });
  }
};



// APPROVE APPOINTMENT
// EMPLOYEE / ADMIN


const approveAppointment = async (
  req,
  res
) => {
  try {

    const appointment =
      await Appointment.findOne({
        _id: req.params.id,
        isDeleted: false
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }


    if (
      appointment.status !== "Pending"
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment is already ${appointment.status}`
      });
    }


    // Employee can only approve
    // appointments assigned to them.

    if (
      req.user.role === "employee" &&
      appointment.host.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only approve appointments assigned to you"
      });
    }


    appointment.status =
      "Approved";

    appointment.approvedBy =
      req.user.id;

    appointment.remarks =
      req.body.remarks || "";


    await appointment.save();


    return res.status(200).json({
      success: true,
      message: "Appointment approved successfully",
      data: appointment
    });

    await notifyUser({

      user: {

        email:
          populatedAppointment
            .visitor
            .email,

        phone:
          populatedAppointment
            .visitor
            .phone

      },

      subject:
        "Appointment Approved",

      emailHtml: `

        <h2>
            Appointment Approved
        </h2>

        <p>
            Your visitor appointment has been approved.
        </p>

        <p>
            <strong>Host:</strong>
            ${populatedAppointment.hostName}
        </p>

        <p>
            <strong>Date:</strong>
            ${new Date(
        populatedAppointment.visitDate
      ).toLocaleDateString()}
        </p>

        <p>
            <strong>Time:</strong>
            ${populatedAppointment.visitTime}
        </p>

        <p>
            Your visitor pass can now be generated.
        </p>

    `,

      smsMessage:
        `Your visitor appointment with ` +
        `${populatedAppointment.hostName} ` +
        `has been approved for ` +
        `${new Date(
          populatedAppointment.visitDate
        ).toLocaleDateString()} ` +
        `at ${populatedAppointment.visitTime}.`

    });

  } catch (error) {

    console.error(
      "Approve appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to approve appointment"
    });
  }
};



// REJECT APPOINTMENT
// EMPLOYEE / ADMIN


const rejectAppointment = async (req,res) => {

    try {

        const appointment =
            await Appointment.findOne({
                _id: req.params.id,
                isDeleted: false
            })
            .populate(
                "visitor",
                "fullName email phone"
            );


        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"

            });

        }


        
        // Must be pending
        

        if (
            appointment.status !==
            "Pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Appointment is already ${appointment.status}`

            });

        }


        
        // Employee authorization
        

        if (
            req.user.role ===
            "employee" &&
            appointment.host.toString() !==
                req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only reject appointments assigned to you"

            });

        }


        
        // Remarks
        

        const remarks =
            req.body.remarks || "";


        
        // Reject appointment
        

        appointment.status =
            "Rejected";

        appointment.approvedBy =
            req.user.id;

        appointment.remarks =
            remarks;


        await appointment.save();


        
        // Notify visitor
        

        const visitor =
            appointment.visitor;


        if (visitor) {

            await notifyUser({

                user: {

                    email:
                        visitor.email,

                    phone:
                        visitor.phone

                },

                subject:
                    "Appointment Rejected",

                emailHtml: `

                    <h2>
                        Appointment Rejected
                    </h2>

                    <p>
                        Your visitor appointment request
                        has been rejected.
                    </p>

                    <p>
                        <strong>Reason:</strong>
                        ${remarks || "No remarks provided"}
                    </p>

                `,

                smsMessage:
                    `Your visitor appointment has been rejected.` +
                    ` Reason: ${remarks || "No remarks provided"}`

            });

        }


        
        // Response
        

        return res.status(200).json({

            success: true,

            message:
                "Appointment rejected successfully",

            data:
                appointment

        });


    } catch (error) {

        console.error(
            "Reject appointment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to reject appointment"

        });

    }

};



// SOFT DELETE APPOINTMENT
// ADMIN


const deleteAppointment = async (
  req,
  res
) => {
  try {

    const appointment =
      await Appointment.findOne({
        _id: req.params.id,
        isDeleted: false
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }


    appointment.isDeleted =
      true;

    await appointment.save();


    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully"
    });

  } catch (error) {

    console.error(
      "Delete appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete appointment"
    });
  }
};


module.exports = {
  createAppointment,
  getMyAppointments,
  getMyEmployeeAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  approveAppointment,
  rejectAppointment,
  deleteAppointment
};