import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    semester:{
        type: Number,
        enum: [1,2,3,4,5,6,7,8],
        required: true
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    examType:{
        type: String,
        enum: ["Mid1", "Mid2", "Final"],
        required: true
    },
    examDate:{
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Exam = mongoose.model("Exam", examSchema)