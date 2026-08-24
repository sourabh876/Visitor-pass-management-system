const mongoose = require("mongoose");

const passSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true
        },

        passNumber: {
            type: String,
            required: true,
            unique: true
        },

        qrCode: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Active",
                "Used",
                "Expired",
                "Cancelled"
            ],
            default: "Active"
        },

        validFrom: {
            type: Date,
            required: true
        },

        validUntil: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Pass",
    passSchema
);