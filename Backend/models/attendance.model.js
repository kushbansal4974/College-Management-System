import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        enum: ["Present", "Absent"],
        required: true
    },
    markedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    }
}, {timestamps: true})

attendanceSchema.index(
    {studentId: 1, subjectId: 1, date: 1},
    {unique: true}
)

export const Attendance = mongoose.model("Attendance", attendanceSchema)