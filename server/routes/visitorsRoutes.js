const express = require("express");

const {
    createMyProfile,
    getMyProfile,
    updateMyProfile,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor
} = require("../controllers/visitorController");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const upload = require("../middleware/upload");

const router = express.Router();


  
// VISITOR'S OWN PROFILE
  

router.post(
    "/me",
    authenticate,
    authorizeRoles("visitor"),
    upload.single("photo"),
    createMyProfile
);


router.get(
    "/me",
    authenticate,
    authorizeRoles("visitor"),
    getMyProfile
);


router.put(
    "/me",
    authenticate,
    authorizeRoles("visitor"),
    upload.single("photo"),
    updateMyProfile
);


  
// ADMIN VISITOR MANAGEMENT
  

router.get(
    "/",
    authenticate,
    authorizeRoles("admin"),
    getVisitors
);


router.get(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    getVisitorById
);


router.put(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    upload.single("photo"),
    updateVisitor
);


router.delete(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    deleteVisitor
);


module.exports = router;