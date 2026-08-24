const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const visitorRoutes = require("./routes/visitorsRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const passRoutes = require("./routes/passRoutes");
const checkLogRoutes = require("./routes/checkLogRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");




const app = express();


// Middleware

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(morgan("dev"));


// Routes

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/visitors",
    visitorRoutes
);

app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/passes",
    passRoutes
);


app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/checklogs",
    checkLogRoutes
);


app.use(
    "/api/reports",
    reportRoutes
);

// Uploaded files

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// Test

app.get("/", (req, res) => {
    res.json({
        success: true,
        message:
            "Visitor Pass Management API is running"
    });
});



module.exports = app;