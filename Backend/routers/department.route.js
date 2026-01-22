import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"
import { createDepartment, deleteDepartment, getAllDepartments, getDepartmentById, updateDepartment } from "../controllers/department.controller.js"

const router = express.Router()

router.route("/departments").post(isAuthenticated, authorizeRoles("Admin"), createDepartment)
router.route("/departments").get(isAuthenticated, getAllDepartments)
router.route("/departments/:id").get(isAuthenticated, getDepartmentById)
router.route("/departments/:id").put(isAuthenticated, authorizeRoles("Admin"), updateDepartment)
router.route("/departments/:id").delete(isAuthenticated, authorizeRoles("Admin"), deleteDepartment)

export default router