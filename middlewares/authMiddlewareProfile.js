import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';
dotenv.config()

export const isAuth = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return res.status(401).send({
            success: false,
            Message: "Aunauthorized user || you do not have tokens"
        })
    }
    const VarifyToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(VarifyToken._id)
    next()
}