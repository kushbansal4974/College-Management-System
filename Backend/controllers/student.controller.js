
export const createStudent = async (req, res) => {
    try {
                
    } catch (e) {
        console.log("Error in createStudents: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}