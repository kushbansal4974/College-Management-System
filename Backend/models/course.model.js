import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    departmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    durationYears:{
        type: Number,
        required: true
    },
    semesters:{
        type: Number,
        required: true,
        validate(value){
            if(value%2 !== 0){
                throw new Error("Semester must be even")
            }
        }
    }
}, {timestamps: true})

export const Course = mongoose.model("Course", courseSchema)