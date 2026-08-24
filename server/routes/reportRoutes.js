const express = require("express");

const router =
    express.Router();

const reportController = require("../controllers/reportController");


const auth = require("../middleware/authMiddleware");




router.get(
    "/appointments",
    auth,
    reportController.exportAppointments
);


router.get(
    "/visitors",
    auth,
    reportController.exportVisitors
);


router.get(
    "/passes",
    auth,
    reportController.exportPasses
);


router.get(
    "/users",
    auth,
    reportController.exportUsers
);


router.get(
    "/checklogs",
    auth,
    reportController.exportCheckLogs
);


module.exports = router;