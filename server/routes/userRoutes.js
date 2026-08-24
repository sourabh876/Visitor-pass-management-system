const express = require("express");

const {
    createUser,
    getEmployees,
    getUsers
} = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


  
// ADMIN CREATES EMPLOYEE / SECURITY
  

router.post(
    "/",
    authenticate,
    authorizeRoles("admin"),
    createUser
);


  
// GET EMPLOYEES
// Visitor + Admin
  

router.get(
    "/employees",
    authenticate,
    authorizeRoles("visitor", "admin"),
    getEmployees
);


  
// GET ALL USERS
// ADMIN ONLY
  

router.get(
    "/",
    authenticate,
    authorizeRoles("admin"),
    getUsers
);


module.exports = router;