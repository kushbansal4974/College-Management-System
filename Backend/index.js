import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRoute from "./routers/user.router.js"
import departmentRoute from "./routers/department.route.js"
import courseRoute from "./routers/course.route.js"
import subjectRoute from "./routers/subject.router.js"

const app = express()

dotenv.config({override: true})

app.get("/", (req, res)=>{
    res.send("Hello World!!!")
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000

app.use("/api/v1/user", userRoute)
app.use("/api/v1/department", departmentRoute)
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/subject", subjectRoute)

app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server running at port ${PORT}`)
})