import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    departmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    qualification:{
        type: String,
        required: true
    },
    experience:{
        type: Number,
        default: 0
    },
    subjectAssigned:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    }],
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[0-9]{10}$/.test(v),
            message: "Mobile number must be 10 digits"
        }
    },
    joiningDate:{
        type: Date,
        default: Date.now()
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

export const Faculty = mongoose.model("Faculty", facultySchema)