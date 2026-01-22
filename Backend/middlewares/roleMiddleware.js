export const authorizeRoles = (...roles) =>{
    try {
        return (req, res, next) =>{
            if(!roles.includes(req.role)){
                return res.status(403).json({
                    message: "Access denied. You are not authorized",
                    success: false
                })
            }
            next()
        }
    } catch (e) {
        console.log("Error in roleMiddleware: ", e)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}