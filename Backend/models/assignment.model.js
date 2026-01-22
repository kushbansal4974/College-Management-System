import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
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
    section:{
        type: String,
        enum: ["A", "B", "C", "D", "E"],
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    fileUrl:{
        type: String,
        required: true
    },
    deadline:{
        type: Date,
        required: true
    },
    submission:[
        {
            studentId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
            fileUrl:{
                type: String,
            },
            submittedAt:{
                type: Date
            },
            marks:{
                type: Number,
                default: null
            }
        }
    ]
}, {timestamps: true})

export const Assignment = mongoose.model("Assignment", assignmentSchema)