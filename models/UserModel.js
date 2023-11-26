import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import colors from 'colors'



dotenv.config()



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exists"],
        trim: true,
        lowercase: true
    },
    dob: {
        type: String,
        required: [true, "dob is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, 'password must be at least 6 characters']
    },
    address: {
        type: String,
        required: [true, "address is required"],
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        required: [true, "city is required"],
        trim: true,
        lowercase: true
    },
    country: {
        type: String,
        required: [true, "country is required"],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, "phone is required"]
    },
    answer: {
        type: String,
        required: [true, "answer is required"],
        trim: true,
        lowercase: true
    },
    profilepic: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true })

// name
// email
// dob
// password
// address
// city
// country
// phone
// answer
// profilepic
// role


UserSchema.pre('save', async function (next) {
    const user = this
    console.log(`before hashing ${user.password}`.rainbow);
    if (!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 10)
    console.log(`${user}`.america);
    console.log(`After hashing -- ${user.password}`.rainbow);
    next()
})

// compare password by bcrypt 
UserSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}

// jwt Token Auth 

UserSchema.methods.genrateToken = function () {
    return jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}



const User = mongoose.model("Users", UserSchema)

export default User