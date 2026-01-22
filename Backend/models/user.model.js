import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: [4, "Username must contains atleast 4 characters"]
        },
        role: {
            type: String,
            enum: ["Student", "Faculty", "Admin"],
            required: true
        },
        profilePic: {
            type: String,
            default: "data:image/png;base64,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"
        },
        
    }, {timestamps: true}
)

export const User = mongoose.model("User", userSchema)