import userModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken'
import colors from 'colors'
import { getDataUri } from '../utils/feature/feature.js';
import cloudinary from 'cloudinary'

export const registerController = async (req, res) => {
    try {
        const { name, email, dob, password, address, city, country, phone, role, answer } = req.body

        if (!name || !email || !dob || !password || !address || !city || !country || !phone || !role || !answer) {
            return res.status(500).send({ status: false, message: 'all fields required' })
        }

        const existingUser = await userModel.findOne({ email: email })

        if (existingUser) {
            return res.status(200).send({
                status: false,
                error: "User already exists"
            })
        }
        const user = await userModel.create({
            name,
            email,
            dob,
            password,
            address,
            city,
            country,
            phone,
            role,
            answer
        })
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        // for postman


        // "name":"",
        // "email":"",
        // "password":"",
        // "address":"",
        // "city":"",
        // "country":"",
        // "phone":"",
        // "role":""
        // "answer":""

        return res.status(200).send({
            success: true,
            message: 'Registration successful please log in',
            user: user,
            // token: token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error: `Error in register API ${error}`
        });
    }
}




export const logInController = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(500).send({
                status: false,
                error: "all fields are required"
            })
        }
        // find user 
        const user = await userModel.findOne({ email: email })
        // validation if user not found
        if (!user) {
            return res.status(404).send({
                status: false,
                error: "user not found"
            })
        }
        // password chacking
        const chackpassword = await user.comparePassword(password)
        if (!chackpassword) {
            return res.status(500).send({
                status: false,
                error: "password mismatch"
            })
        }
        // token 
        const token = user.genrateToken()

        return res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
            // secure: process.env.NODE_ENV === "development" ? true : false,

        }).send({
            status: true,
            message: "Login successfully",
            user,
            token
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            error: `Error in LOGIN API ${error}`
        });
    }
}

// get user profile

export const profileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        return res.status(200).send({
            success: true,
            message: `profile get succesfully`,
            user
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            error: `Error in profile API ${error}`
        });
    }
}


export const logOutController = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
        }).send({
            success: true,
            message: `Logout Successfully`
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Error in logout API ${error}`
        });
    }
}


export const updateProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { name, email, address, city, country, phone } = req.body;
        // Validation || update
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;
        // save user
        await user.save();
        res.status(200).send({
            success: true,
            message: 'User update successfully'
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Error in update API ${error}`
        });
    }
}



export const updatePasswordController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "please enter your old password and new password"
            })
        }


        if (oldPassword === newPassword) {
            return res.status(500).send({
                success: false,
                message: "old password not new password does not same"
            })
        }

        // check old password
        const isMatch = await user.comparePassword(oldPassword)

        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "old password does not match"
            })
        }

        user.password = newPassword
        await user.save()
        return res.status(200).send({
            success: true,
            message: "password update successfully"
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Error in update password API ${error}`.rainbow
        });
    }
}


// update user profile photo

export const updateProfilePicController = async (req, res) => {
    try {
        // find user 
        const user = await userModel.findById(req.user._id)
        if (!req.file) {
            return res.status(400).send({ message: 'please select file' });
        }
        // photo get 
        const file = getDataUri(req.file)
        // delete old photo in data
        await cloudinary.v2.uploader.destroy(user.profilepic.public_id)
        // update
        const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content)
        // upload image 
        user.profilepic = {
            public_id: cloudinaryDB.public_id,
            url: cloudinaryDB.secure_url
        }

        // save 
        await user.save()

        // send res
        return res.status(200).send({
            success: true,
            message: 'upload image successfully'
        })


    } catch (error) {
        console.log(colors.rainbow(error));
        return res.status(500).send({
            success: false,
            message: `Error in update profile picture API ${error}`.rainbow
        });
    }
}

// reset passwords

export const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body
        // validation
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: `Please provide all fields all fields are required`
            });
        }



        const user = await userModel.findOne({ email, answer })
        // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `invalid user and answer`
            });
        }



        user.password = newPassword
        await user.save()

        return res.status(200).send({
            success: true,
            message: `password updated successfully and logged in`
        });


    } catch (error) {
        console.log(colors.rainbow(error));
        return res.status(500).send({
            success: false,
            message: `Error in reset password API ${error}`
        });
    }
}

// get all user 

export const getAllUsersController = async (req, res) => {

    try {
        const allUser = await userModel.find({})

        if (!allUser) {
            return res.status(404).send({
                seccess: false,
                error: "user not found"
            })
        }

        return res.status(200).send({
            seccess: true,
            message: "list of all user ",
            length: allUser.length,
            allUser
        })
    } catch (error) {
        console.log(error);
    }
    return res.status(404).send({
        seccess: false,
        error: "error in user not found API response"
    })
}



