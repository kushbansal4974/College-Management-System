import mongoose from "mongoose"
import { Subject } from "../models/subject.model.js"
import { Course } from "../models/course.model.js"
import { Faculty } from "../models/faculty.model.js"

export const createSubject = async (req, res) => {
    try {
        const {name, code, courseId, semester, facultyId, credits} = req.body
        const role = req.role

        if(!name || !code || !courseId || !semester || !credits){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Access denied. Only admin can create subjects",
                success: false
            })
        }

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid course ID",
                success: false
            })
        }

        const existingSubject = await Subject.findOne({name, courseId})
        if(existingSubject){
            return res.status(400).json({
                message: "Subject already created in this course",
                success: false
            })
        }

        const existingCode = await Subject.findOne({code})
        if(existingCode){
            return res.status(400).json({
                message: "Code uses already",
                success: false
            })
        }


        const course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({
                message: "Course not found",
                success: false
            })
        }

        if(semester > course.semesters){
            return res.status(400).json({
                message: "Please choose a valid semester",
                success: false
            })
        }

        if(facultyId && !mongoose.Types.ObjectId.isValid(facultyId)){
            return res.status(400).json({
                message: "Invalid Faculty ID",
                success: false
            })
        }

        await Subject.create({
            name,
            code,
            courseId,
            semester: Number(semester),
            facultyId: facultyId || null,
            credits: Number(credits)
        })

        return res.status(201).json({
            message: "Subject created successfully",
            success: true
        })


    } catch (e) {
        console.log("Error in createSubject: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const getSubjectById = async (req, res) => {
    try {
        const subjectId = req.params.id
        
        if(!mongoose.Types.ObjectId.isValid(subjectId)){
            return res.status(400).json({
                message: "Invalid Subject ID",
                success: false
            })
        }

        const subject = await Subject.findById(subjectId)
        .populate("courseId" , "name")
        .populate("facultyId", "name email")

        if(!subject){
            return res.status(404).json({
                message: "Subject not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Subject fetched successfully",
            subject,
            success: true
        })

    } catch (e) {
        console.log("Error in getSubjectById: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const getSubjectByCourse = async (req, res) => {
    try {
        const courseId = req.params.id

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid Course ID",
                success: false
            })
        }

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                message: "Course not found",
                success: false
            })
        }

        const subjects = await Subject.find({courseId})
        .sort({semester: 1})
        .populate("facultyId", "name")
        .populate("courseId", "name")

        let count = subjects.length

        if(count === 0){
            return res.status(200).json({
                message: "No subject found in this product",
                count,
                success: true
            })
        }

        return res.status(200).json({
            message: "Subjects fetched successfully",
            count,
            subjects,
            success: true
        })

    } catch (e) {
        console.log("Error in getSubjectByCourse: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const updateSubject = async (req, res) => {
    try {
        const {name, code, courseId, semester, facultyId, credits} = req.body
        const subjectId = req.params.id
        const role = req.role
        
        if(!mongoose.Types.ObjectId.isValid(subjectId)){
            return res.status(400).json({
                message: "Invalid Subject ID",
                success: false
            })
        }


        if(role !== "Admin"){
            return res.status(403).json({
                message: "Only Admin can Update",
                success: false
            })
        }
        
        if(courseId && !mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid Course Id",
                success: false
            })
        }

        if(facultyId && !mongoose.Types.ObjectId.isValid(facultyId)){
            return res.status(400).json({
                message: "Invalid Faculty ID",
                success: false
            })
        }



        if(courseId || semester){
            let course = await Course.findById(courseId)
            if(!course){
                return res.status(404).json({
                    message: "Course not found",
                    success: false
                })
            }

            if(semester > course.semesters){
                return res.status(400).json({
                    message: "Please Enter a valid semester",
                    success: false
                })
            }
        }

        let subject = await Subject.findById(subjectId)
        if(!subject){
            return res.status(404).json({
                message: "Subject not found",
                success: false
            })
        }

        if(facultyId){
            let faculty = await Faculty.findById(facultyId)
            if(!faculty){
                return res.status(404).json({
                    message: "Faculty not found",
                    success: false
                })
            }
        }

        if(name){
            const existingSubject = await Subject.findOne({name, courseId})
            if(existingSubject){
                return res.status(400).json({
                    message: "Subject already exists",
                    success: false
                })
            }
        }

        if(code){
            const existingCode = await Subject.findOne({code, courseId})
            if(existingCode){
                return res.status(400).json({
                    message: "Code already exists",
                    success: false
                })
            }
        }

        subject = await Subject.findByIdAndUpdate(
            subjectId,
            {
                ...(name && {name}),
                ...(code && {code}),
                ...(courseId && {courseId}),
                ...(semester && {semester}),
                ...(facultyId && {facultyId}),
                ...(credits && {credits}),
            },
            {
                runValidators: true,
                new: true
            }
        )

        return res.status(200).json({
            message: "Subject updated successfully",
            subject,
            success: true
        })

    } catch (e) {
        console.log("Error in updateSubject: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const deleteSubject = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}