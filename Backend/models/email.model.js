import mongoose from "mongoose";

const verifiedEmailsSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        requird: true,
        trim: true
    },
    verifiedAt:{
        type: Date,
        default: Date.now()
    }
})

export const verifiedEmails = mongoose.model("verifiedEmails", verifiedEmailsSchema)