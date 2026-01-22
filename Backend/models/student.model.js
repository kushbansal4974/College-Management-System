import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
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
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    rollNo:{
        type: String,
        required: true,
        unique: true
    },
    semester:{
        type: String,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        required: true
    },
    section:{
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[0-9]{10}$/.test(v),
            message: "Mobile number must be 10 digits"
        }
    },
    fatherName:{
        type: String,
        required: true
    },
    motherName:{
        type: String,
        required: true
    },
    parentContact:{
        type: String,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    admissionYear:{
        type: Number,
        required: true
    },
    profileComplete: {
        type: Boolean,
        default: false
    }
})

export const Student = mongoose.model("Student", studentSchema)