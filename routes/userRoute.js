import express from "express";
import {
    getAllUsersController,
    logInController,
    logOutController,
    profileController,
    registerController,
    resetPasswordController,
    updatePasswordController,
    updateProfileController,
    updateProfilePicController
} from "../controller/userController.js";
import { rateLimit } from 'express-rate-limit'
import { isAuth } from "../middlewares/authMiddlewareProfile.js";
import { singleUpload } from "../middlewares/multer.js";
import dotenv from 'dotenv'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})


dotenv.config()
const router = express.Router()

// Router

// register
router.post('/register', limiter, registerController)
// login
router.post('/login', limiter, logInController)
// profile
router.get('/profile', isAuth, profileController)
// logout
router.get('/logout', isAuth, logOutController)
// update profile 
router.put('/update-profile', isAuth, updateProfileController)
// update password
router.put('/update-password', isAuth, updatePasswordController)
// update profile picture
router.put('/update-picture', isAuth, singleUpload, updateProfilePicController)
// forgot password
router.post("/reset-password", resetPasswordController)
// get all user 
router.get('/get-all-users', getAllUsersController)



export default router