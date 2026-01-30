import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Department } from "../models/department.model.js"
import { Subject } from "../models/subject.model.js"
import { Faculty } from "../models/faculty.model.js"

export const createFaculty = async (req, res) => {
    try {
        const {departmentId, designation, qualification, experience, subjectAssigned, mobile, joiningDate, gender, address} = req.body
        const userId = req.id
        const role = req.role

        if(!userId || !departmentId || !designation || !qualifications || !mobile || !gender || !address){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        if(!mongoose.Types.ObjectId.isValid(departmentId)){
            return res.status(400).json({
                message: "Invalid id",
                success: false
            })
        }

        if (subjectAssigned  && !mongoose.Types.ObjectId.isValid(subjectAssigned)) {
            return res.status(400).json({
                message: "Invalid id",
                success: false
            })
        }

        if(role !== "Faculty" && role !== "Admin"){
            return res.status(403).json({
                message: "Unauthorized role",
                success: false
            })
        }

        const user = await User.findById(userId)
        .select("name email")

        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const department = await Department.findById(departmentId)
        .select("name code")

        if(!department){
            return res.status(404).json({
                message: "Department not found",
                success: false
            })
        }

        if (!["sr. faculty", "jr. faculty", "dy. hod", "hod"].includes(designation)){
            return res.status(400).json({
                message: "Please select right designation",
                success: false
            })
        }

        if(Number(experience) < 0){
            return res.status(400).json({
                message: "Negative number not allowed",
                success: false
            })
        }

        if (subjectAssigned) {
            const subject = await Subject.findById(subjectAssigned).select("name code")
            
            if (!subject) {
                return res.status(404).json({
                    message: "Subject not found",
                    success: false
                })
            }
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({
                message: "Enter only 10 digits number",
                success: false
            })
        }

        const faculty = await Faculty.create({
            userId,
            departmentId,
            designation,
            qualification,
            experience: Number(experience) || 0,
            subjectAssigned: subjectAssigned ? [subjectAssigned]: [],
            mobile,
            joiningDate: joiningDate || Date.now(),
            gender,
            address
        })
        
        return res.status(201).json({
            faculty,
            message: "Faculty created successfully",
            success: true
        })


    } catch (error) {
        console.log("Error in createFaculty: ", error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}