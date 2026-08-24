const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const passController = require("../controllers/passController");


// Create Pass
router.post(
    "/",
    auth,
    role("admin", "employee"),
    passController.createPass
);

router.get("/me",
    auth,
    role("visitor"),
    passController.getVisitorPasses
)

// Get All Passes
router.get(
    "/",
    auth,
    passController.getPasses
);

router.get(
    "/appointment/:appointmentId",
    auth,
    passController.getPassByAppointmentId
);

// Get Pass By ID
router.get(
    "/:id",
    auth,
    passController.getPassById
);


// Get Pass By Pass Number
router.get(
    "/number/:passNumber",
    auth,
    passController.getPassByNumber
);


// Generate PDF
router.get(
    "/:id/pdf",
    auth,
    passController.generatePassPDF
);


// Cancel Pass
router.put(
    "/:id/cancel",
    auth,
    role("admin", "employee"),
    passController.cancelPass
);


module.exports = router;