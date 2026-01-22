import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    semester:{
        type: Number,
        required: true
    },
    facultyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        default: null
    },
    credits:{
        type: Number,
        required: true
    }
})

export const Subject = mongoose.model("Subject", subjectSchema)