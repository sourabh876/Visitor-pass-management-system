const express = require("express");

const {
    createAppointment,
    getMyAppointments,
    getMyEmployeeAppointments,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    approveAppointment,
    rejectAppointment,
    deleteAppointment
} = require("../controllers/appointmentController");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


  
// VISITOR
  

router.post(
    "/",
    authenticate,
    authorizeRoles("visitor"),
    createAppointment
);


router.get(
    "/my",
    authenticate,
    authorizeRoles("visitor"),
    getMyAppointments
);


  
// EMPLOYEE
  

router.get(
    "/employee",
    authenticate,
    authorizeRoles("employee"),
    getMyEmployeeAppointments
);


  
// ADMIN
  

router.get(
    "/",
    authenticate,
    authorizeRoles("admin"),
    getAllAppointments
);


  
// COMMON GET BY ID
  

router.get(
    "/:id",
    authenticate,
    authorizeRoles(
        "admin",
        "employee",
        "visitor",
        "security"
    ),
    getAppointmentById
);


  
// UPDATE
  

router.put(
    "/:id",
    authenticate,
    authorizeRoles(
        "admin",
        "visitor"
    ),
    updateAppointment
);


  
// APPROVE
  

router.patch(
    "/:id/approve",
    authenticate,
    authorizeRoles(
        "admin",
        "employee"
    ),
    approveAppointment
);


  
// REJECT
  

router.patch(
    "/:id/reject",
    authenticate,
    authorizeRoles(
        "admin",
        "employee"
    ),
    rejectAppointment
);


  
// DELETE
  

router.delete(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    deleteAppointment
);


module.exports = router;