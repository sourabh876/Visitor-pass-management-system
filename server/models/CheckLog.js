const mongoose = require("mongoose");

const checkLogSchema = new mongoose.Schema(
    {
        pass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pass",
            required: true
        },

        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor",
            required: true
        },

        securityUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        checkInTime: {
            type: Date,
            default: null
        },

        checkOutTime: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["Inside", "Checked-Out"],
            default: "Inside"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CheckLog", checkLogSchema);