import mongoose from "mongoose"
import { Course } from "../models/course.model.js"
import { Department } from "../models/department.model.js"

export const createCourse = async (req, res) => {
    try {
        const {name, departmentId,durationYears, semesters} = req.body
        const role = req.role

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Only admin can create course",
                success: false
            })
        }

        if(!name|| !departmentId || !durationYears || !semesters){
            return res.status(400).json({
                message: "All fields required",
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({
                message: "Invalid department ID",
                success: false
            })
        }

        if(semesters%2 !== 0){
            return res.status(400).json({
                message: "Semester must be even",
                success: false
            })
        }

        const department = await Department.findById(departmentId)
        if(!department){
            return res.status(404).json({
                message: "Department does not exists",
                success: false
            })
        }

        const existingCourse = await Course.findOne({name})
        if(existingCourse){
            return res.status(400).json({
                message: "Already Created",
                success: false
            })
        }

        const course = await Course.create({
            name,
            departmentId,
            durationYears: Number(durationYears),
            semesters: Number(semesters)
        })

        return res.status(201).json({
            message: "Course created successfully",
            course,
            success: true
        })


    } catch (e) {
        console.log("Error in createCourse: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const getAllCourses = async (req, res) => {
    try {
        let courses = await Course.find()
        .sort({name: 1})
        .populate("departmentId", "name")

        let count = courses.length

        if (count === 0) {
            return res.status(200).json({
                message: "No courses found",
                count: 0,
                courses: [],
                success: true
            })
        }

        return res.status(200).json({
            message: "Courses fetched successfully",
            count,
            courses,
            success: true
        })

    } catch (e) {
        console.log("Error in getAllCourses: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id
        
        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid Course ID",
                success: false
            })
        }

        const course = await Course.findById(courseId)
        .populate("departmentId", "name")
        
        if(!course){
            return res.status(404).json({
                message: "Course not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Course fetched successfully",
            course,
            success: true
        })

    } catch (e) {
        console.log("Error in getCourseById: ", e)        
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const {name, departmentId, durationYears, semesters} = req.body
        const courseId = req.params.id
        const role = req.role

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid Course ID",
                success: false
            })
        }

        if (departmentId && !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({
                message: "Invalid Department ID",
                success: false
            });
        }

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Access Denied. Only admin can update course",
                success: false
            })
        }
        
        let course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({
                message: "Course not found",
                success: false
            })
        }

        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({
                    message: "Department not found",
                    success: false
                });
            }
        }

        if (semesters && semesters % 2 !== 0) {
            return res.status(400).json({
                message: "Semesters must be even",
                success: false
            });
        }

        course = await Course.findByIdAndUpdate(
            courseId,
            {
                ...(name && { name }),
                ...(departmentId && { departmentId }),
                ...(durationYears && { durationYears: Number(durationYears) }),
                ...(semesters && { semesters: Number(semesters) })
            },
            { 
                new: true ,
                runValidators: true
            }
        );


        return res.status(200).json({
            message: "Course Updated Successfully",
            course,
            success: true
        })

    } catch (e) {
        console.log("Error in updateCourse: ", e)        
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        const role = req.role

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid Course ID",
                success: false
            })
        }

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Access Denied. Only admin can delete course",
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

        await course.deleteOne()

        return res.status(200).json({
            message: "Course deleted Successfully",
            success: true
        })

    } catch (e) {
        console.log("Error in deleteCourse: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}