import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db.js'
import testRoute from './routes/testRoute.js';
import userRoute from './routes/userRoute.js'
import cookieParser from 'cookie-parser'
import cloudinary from 'cloudinary'
import helmet from 'helmet'
import Stripe from 'stripe'
import mongoSanitize from 'express-mongo-sanitize'


import productRoute from './routes/productRoutes/productRoutes..js'
import categoryRoute from './routes/category/categoryRoutes.js'
import orderRoute from './routes/order/orderRoutes.js'

dotenv.config()

connectDB()


// stripe

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,

})


const app = express()

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(mongoSanitize())

app.use('/api/v1', testRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/user/product', productRoute)
app.use('/api/v1/user/category', categoryRoute)
app.use('/api/v1/user/order', orderRoute)

// inictial route

app.get('/', (req, res) => {
    return res.send({ status: true, message: "this is a home page" })
    // return res.send("<h1>Welcome to home page</h1>")
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT} on ${process.env.NODE_ENV} Mode ...  `.bgRed.white);
})