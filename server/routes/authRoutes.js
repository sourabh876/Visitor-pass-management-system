const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();


// Visitor registration
router.post(
    "/register",
    register
);


// Login for all roles
router.post(
    "/login",
    login
);


module.exports = router;