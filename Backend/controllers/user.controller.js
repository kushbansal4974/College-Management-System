import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../utils/cloudinary.js"
import { verifiedEmails } from "../models/email.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js"

export const register = async (req, res) => {
    try {
        
        const {name, email, password, role} = req.body

        if(!name || !email || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        let profilePicUrl = "data:image/png;base64,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"

        const image = req.file

        if(image){
                const uploadResult = await cloudinary.uploader.upload(
                `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
                { folder: "users" }
            );

            profilePicUrl = uploadResult.secure_url
        }
        
 
      
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message: "User already exists!",
                success: false
            })
        }

        const verified = await verifiedEmails.findOne({email})

        if(!verified){
            return res.status(400).json({
                message: "Email not verified",
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            email,
            password: hashPassword,
            role,
            profilePic: profilePicUrl,
        })

        await sendEmail(
            email,
            "My College",
            `<p>
                Welcome, <b>${name}</b> to <b>My College</b>. You joined us as a <b>${role} </b>. <br/>
                This is a Welcome email. <br/>
                Thank you for joining us!
            </p>` 
        )

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })

    } catch (e) {
        console.log("Error in register: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        
        const {email, password, role} = req.body

        if(!email || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        if(role != user.role){
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            })
        }

        const tokenData = {
            userId: user._id,
            role: user.role
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d"
        })

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1*24*60*60*1000,
            httpsOnly: true,
            sameSite: "strict"
        }).json({
            "message": `Welcome Back ${user.name}`,
            success: true,
            user
        })

    } catch (e) {
        console.log("Error in login: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const logout = async(req, res) => {
    try {
        
        return res.status(200).cookie("token", "", {
            maxAge: 0
        }).json({
            message: "Logout successfully",
            success: true
        })

    } catch (e) {
        console.log("Error in logout: ",e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

