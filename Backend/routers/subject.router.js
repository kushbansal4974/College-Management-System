import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"
import { assignSubjectToFaculty, createSubject, deleteSubject, getSubjectByCourseAndSemester, getSubjectById, getSubjectsForFaculty, getSubjectsForStudents, getSubjectsOfCourse, updateSubject } from "../controllers/subject.controller.js"


const router = express.Router()

router.route("/").post(isAuthenticated, authorizeRoles("Admin"), createSubject)

router.route("/:id")
    .get(isAuthenticated, getSubjectById)
    .put(isAuthenticated, authorizeRoles("Admin"), updateSubject)
    .delete(isAuthenticated, authorizeRoles("Admin"), deleteSubject)

router.route("/course/:id/subjects").get(isAuthenticated, getSubjectsOfCourse)

router.route("/course/:courseId/semester/:semester").get(isAuthenticated, authorizeRoles("Admin", "Faculty"), getSubjectByCourseAndSemester)

router.route("/student/me").get(isAuthenticated, authorizeRoles("Student"), getSubjectsForStudents)

router.route("/:id/assign-faculty").patch(isAuthenticated, authorizeRoles("Admin"), assignSubjectToFaculty)

router.route("/faculty/me").get(isAuthenticated, authorizeRoles("Faculty"), getSubjectsForFaculty)

router.route("/faculty/:id").get(isAuthenticated, authorizeRoles("Admin"), getSubjectsForFaculty)

export default router