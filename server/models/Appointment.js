const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor",
            required: true
        },

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        hostName: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        purpose: {
            type: String,
            required: true,
            trim: true
        },

        visitDate: {
            type: Date,
            required: true
        },

        visitTime: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected"
            ],
            default: "Pending"
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        remarks: {
            type: String,
            trim: true,
            default: ""
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

appointmentSchema.index({
    visitor: 1
});

appointmentSchema.index({
    host: 1
});

appointmentSchema.index({
    status: 1
});

module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);