import mongoose from "mongoose"
import { Subject } from "../models/subject.model.js"
import { Course } from "../models/course.model.js"
import { Faculty } from "../models/faculty.model.js"
import { Student } from "../models/student.model.js"

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

        const subject = await Subject.create({
            name,
            code,
            courseId,
            semester: Number(semester),
            facultyId: facultyId || null,
            credits: Number(credits)
        })

        return res.status(201).json({
            subject,
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

export const getSubjectsOfCourse = async (req, res) => {
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
                message: "No subject found in this course",
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
                message: "Only admin can delete subject",
                success: false
            })
        }

        const subject = await Subject.findByIdAndDelete(subjectId)

        if(!subject){
            return res.status(404).json({
                message: "Subject not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Subject deleted successfully",
            success: true
        })


    } catch (error) {
        console.log("Error in deleteSubject: ",error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const getSubjectsForStudents = async (req, res) => {
    try {
        const userId = req.id
        const role = req.role

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({
                message: "Invalid ID",
                success: false
            })
        }

        if(role !== "Student"){
            return res.status(403).json({
                message: "Only students can see",
                success: false
            })
        }

        const student = await Student.findById(userId)

        if(!student){
            return res.status(404).json({
                message: "Student not found",
                success: false
            })
        }

        const {courseId, semester} = student

        const subjects = await Subject.find({
            courseId,
            semester
        })

        if(subjects.length === 0){
            return res.status(200).json({
                message: "Subjects not found",
                success: true
            })
        }

        return res.status(200).json({
            subjects,
            message: "Subjects found",
            success: true
        })
        
    } catch (error) {
        console.log("Error in getSubjectsForStudents: ",error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const getSubjectByCourseAndSemester = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const semester = Number(req.params.semester)
        const role = req.role

        if(role !== "Admin" && role !== "Faculty"){
            return res.status(403).json({
                message: "Only admins and faculties have access",
                success: false
            })
        }

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid Course ID",
                success: false
            })
        }

        if (!semester || semester <= 0) {
            return res.status(400).json({
                message: "Invalid semester",
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

        const {semesters} = course

        if(semesters < semester){
            return res.status(400).json({
                message: "Enter valid semester",
                success: false
            })
        }

        const subjects = await Subject.find({
            courseId,
            semester
        })

        if(subjects.length === 0){
            return res.status(200).json({
                subjects: [],
                message: "No subject found",
                success: true
            })
        }

        return res.status(200).json({
            subjects,
            message: "Subjects found",
            success: true
        })

    } catch (error) {
        console.log("Error in getSubjectByCourseAndSemester: ", error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const assignSubjectToFaculty = async (req, res) => {
    try {
        const subjectId = req.params.id
        const {facultyId} = req.body
        const role = req.role

        if(!mongoose.Types.ObjectId.isValid(subjectId)){
            return res.status(400).json({
                message: "Invalid ID",
                success: false
            })
        }

        if(!mongoose.Types.ObjectId.isValid(facultyId)){
            return res.status(400).json({
                message: "Invalid ID",
                success: false
            })
        }

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Only Admin can assign",
                success: false
            })
        }

        let subject = await Subject.findById(subjectId)
        const faculty = await Faculty.findById(facultyId)
        .populate("userId", "name")

        if(!subject){
            return res.status(404).json({
                message: "Subject not found",
                success: false
            })
        }

        if(!faculty){
            return res.status(404).json({
                message: "Faculty not found",
                success: false
            })
        }


        if (subject.facultyId && subject.facultyId.toString() === facultyId){
            return res.status(400).json({
                message: "Faculty already assigned to this subject",
                success: false
            })
        }

        subject.facultyId = facultyId
        await subject.save()

        faculty.subjectAssigned.push(subject._id)
        await faculty.save()

        return res.status(200).json({
            message: `${faculty.userId?.name} is assigned to ${subject.name}`,
            success: true
        })

    } catch (error) {
        console.log("Error in assignSubjectToFaculty: ", error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const getSubjectsForFaculty = async (req, res) => {
    try {
        const role = req.role
        let facultyId

        if (role === "Faculty") {
            facultyId = req.id
        }
        else if (role === "Admin") {
            facultyId = req.params.id
        } 
        else {
            return res.status(403).json({
                message: "Access denied",
                success: false
            })
        }

        if(!mongoose.Types.ObjectId.isValid(facultyId)){
            return res.status(400).json({
                message: "Invalid ID",
                success: false
            })
        }

        const faculty = await Faculty.findById(facultyId)
        .populate({
            path: "subjectAssigned",
            select: "name code semester courseId",
            populate: {
                path: "courseId",
                select: "name"
            }
        })

        if(!faculty){
            return res.status(404).json({
                message: "Faculty not found",
                success: false
            })
        }

        const subjects = faculty.subjectAssigned
        let count = subjects.length

        if(count === 0){
            return res.status({
                message: "No subject assigned",
                success: true
            })
        }

        return res.status(200).json({
            count,
            subjects,
            message: "Subject found",
            success: true
        })


    } catch (error) {
        console.log("Error in getSubjectsForFaculty: ", error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}