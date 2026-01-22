import mongoose from "mongoose";

const feeSummarySchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    totalFee: {
        type: Number,
        required: true
    },
    paidFee: {
        type: Number,
        default: 0
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const FeeSummary = mongoose.model("FeeSummary", feeSummarySchema);
