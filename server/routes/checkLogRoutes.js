const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const checkLogController = require(
    "../controllers/checkLogController"
);


// Check In
router.post(
    "/check-in",
    auth,
    role("admin", "security"),
    checkLogController.checkInVisitor
);


// Check Out
router.post(
    "/check-out",
    auth,
    role("admin", "security"),
    checkLogController.checkOutVisitor
);


// All Check Logs
router.get(
    "/",
    auth,
    role("admin", "security"),
    checkLogController.getCheckLogs
);


// Visitors Currently Inside
router.get(
    "/inside",
    auth,
    role("admin", "security"),
    checkLogController.getVisitorsInside
);


module.exports = router;