import Jwt from "jsonwebtoken";



// for admin 

// agar wo admin nahi hain to kuch route access nahi kar sakta hain 

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).send({
            success: false,
            Message: "Admin only"
        })
    }
    next()
}