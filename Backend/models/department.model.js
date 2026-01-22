import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type: String,
        default: null
    },
    hod:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        default: null
    }
}, {timestamps: true})

export const Department = mongoose.model("Department", departmentSchema)