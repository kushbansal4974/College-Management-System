import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    summaryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeeSummary",
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    mode:{
        type: String,
        enum: ["Cash", "UPI", "Card", "Online"],
        required: true
    },
    status:{
        type: String,
        enum: ["Success", "Failed", "Pending"],
        required: true
    },
    transactionId:{
        type: String,
        required: true
    }
}, {timestamps: true})

export const FeePayment = mongoose.model("FeePayment", feePaymentSchema)