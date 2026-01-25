import express from "express"
import { verifyEmail, verifyOtp } from "../controllers/email.controller.js"
import { login, logout, register } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.js"

const router = express.Router()

router.route("/verify-email").post(verifyEmail)
router.route("/verify-otp").post(verifyOtp)
router.route("/register").post(upload, register)
router.route("/login").post(login)
router.route("/logout").get(logout)

export default router