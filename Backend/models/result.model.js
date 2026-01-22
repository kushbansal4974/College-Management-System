import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    semester:{
        type: Number,
        required: true
    },
    examType:{
        type: String,
        enum: ["Mid1", "Mid2", "Final"],
        required: true
    },
    examDate:{
        types: Date,
        required: true
    },
    marks:{
        type: Number,
        required: true
    },
    maxMarks:{
        type: Number,
        required: true
    },
    remarks: {
        type: String,
        enum: ["Pass", "Fail", "Absent"],
        default: "Pass"
    }
},{timestamps: true})

export const Result = mongoose.model("Result", resultSchema)