import { Department } from "../models/department.model.js"
import { Faculty } from "../models/faculty.model.js"
import mongoose from "mongoose"

export const createDepartment = async(req, res) => {
    try {
        const role = req.role
        const {name, code} = req.body

        if(!name || name.trim() === ""){
            return res.status(400).json({
                message: "Department name is required",
                success: false
            })
        }

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Only admin can create department",
                success: false
            })
        }

        const existingDepartment = await Department.findOne({name})
        if(existingDepartment){
            return res.status(400).json({
                message: "This one is already created"
            })
        }
        
        if(code){
            const existingCode = await Department.findOne({code})
            if(existingCode){
                return res.status(400).json({
                    message: "This code is already used for another Department"
                })
            }
        }

        const department = await Department.create({
            name,
            code,
            hod: hod || null
        })

        return res.status(201).json({
            message: "Department Created Successfully",
            department,
            success: true
        })

    } catch (e) {
        console.log("Error in createDepartment: ",e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const getAllDepartments = async(req, res) => {
    try {
        let departments = await Department.find()
        .sort({name: 1})
        .populate("hod", "name email")

        let count = departments.length

        if (count === 0) {
            return res.status(200).json({
                message: "No department found",
                count: 0,
                courses: [],
                success: true
            })
        }

        return res.status(200).json({
            message: "Departments fetched successfully",
            departments,
            count,
            success: true
        })

    } catch (e) {
        console.log("Error in getAllDepartments: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const getDepartmentById = async(req, res) => {
    try {
        const depId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(depId)) {
            return res.status(400).json({
                message: "Invalid Department ID",
                success: false,
            });
        }

        const department = await Department.findById(depId)
        .populate("hod", "name email")

        if(!department){
            return res.status(404).json({
                message: "Department not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Department fetched successfully",
            department,
            success: true
        })

    } catch (e) {
        console.log("Error in getDepartmentById",e)        
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const updateDepartment = async (req, res) => {
    try {
        const {name, code, hod} = req.body
        const deptId = req.params.id
        const role = req.role

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Only admins can update details",
                success: false
            })
        }

        if(!mongoose.Types.ObjectId.isValid(deptId)){
            return res.status(400).json({
                message: "Invalid Department Id",
                success: false
            })
        }

        if(!hod === null){
            if(!mongoose.Types.ObjectId.isValid(hod)){
                return res.status(400).json({
                    message: "Invalid Hod Id",
                    success: false
                })
            }
        }


        let department = await Department.findById(deptId)

        if(!department){
            return res.status(404).json({
                message: "Department not found",
                success: false
            })
        }

        department = await Department.findByIdAndUpdate(
            deptId,
            {
                ...(name && {name}),
                ...(code && {code}),
                ...(hod && {hod})
            },
            {
                new: true,
                runValidators: true
            }
        )

        return res.status(200).json({
            message: "Department updated successfully",
            department,
            success: true
        })

    } catch (e) {
        console.log("Error in updateDepartment: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const deleteDepartment = async (req, res) => {
    try {
        const role = req.role
        const deptId = req.params.id

        if(!mongoose.Types.ObjectId.isValid(deptId)){
            return res.status(400).json({
                message: "Invalid department ID",
                success: false
            })
        }

        if(role !== "Admin"){
            return res.status(403).json({
                message: "Only admin can delete department",
                success: false
            })
        }

        const department = await Department.findById(deptId)

        if(!department){
            return res.status(404).json({
                message: "Department not found!",
                success: false
            })
        }

        await department.deleteOne()

        return res.status(200).json({
            message: "Deleted department successfully",
            success: true
        })

    } catch (e) {
        console.log("Error in deleteDepartment: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}