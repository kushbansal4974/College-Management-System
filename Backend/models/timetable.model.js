import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    semester:{
        type: Number,
        required: true
    },
    day:{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        required: true
    },
    slots:[
        {
            startTime:{
                type: String, 
                required: true
            },
            endTime:{
                type: String,
                required: true
            },
            subjectId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: true
            },
            facultyId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Faculty",
                required: true
            },
            roomNo:{
                type: String,
                required: true
            }
        }
    ]
})

export const Timetable = mongoose.model("Timetable", timetableSchema)