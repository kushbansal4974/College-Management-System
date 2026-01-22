import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/course.controller.js"

const router = express.Router()

router.route("/courses").post(isAuthenticated, authorizeRoles("Admin"), createCourse)
router.route("/courses").get(isAuthenticated, getAllCourses)
router.route("/courses/:id").get(isAuthenticated, getCourseById)
router.route("/courses/:id").put(isAuthenticated, authorizeRoles("Admin"), updateCourse)
router.route("/courses/:id").delete(isAuthenticated, authorizeRoles("Admin"), deleteCourse)

export default router