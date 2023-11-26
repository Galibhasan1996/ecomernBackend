import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'address is required'],
            trim: true,
            lowercase: true
        },
        city: {
            type: String,
            required: [true, 'city name is required'],
            trim: true,
            lowercase: true
        },
        country: {
            type: String,
            required: [true, 'country is required'],
            trim: true,
            lowercase: true
        }
    },
    orderItem: [
        {
            name: {
                type: String,
                required: [true, 'product name is required'],
                trim: true,
                lowercase: true
            },
            price: {
                type: Number,
                required: [true, 'product price is required'],
                trim: true,
            },
            quantity: {
                type: Number,
                required: [true, 'product quantity is required'],
                trim: true,
            },
            image: {
                type: String,
                required: [true, 'product image is required'],
                trim: true,
                lowercase: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Porducts",
                required: [true, 'product products is required'],
            }
        }
    ],
    paymentMethods: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, 'user id is required'],
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String,
    },
    itemPrice: {
        type: Number,
        required: [true, 'item price is required'],
    },
    tax: {
        type: Number,
        required: [true, 'tax price is required'],
    },
    shippingCharges: {
        type: Number,
        required: [true, 'item shippingCharges is required'],
    },
    totalAmount: {
        type: Number,
        required: [true, 'item totalAmount is required'],
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered",],
        default: "processing",
    },
    deliveredAt: Date

}, { timestamps: true })
const orderModel = mongoose.model("order", orderSchema)
export default orderModel





// for postman testing

// {
//     "shippingInfo":{
//         "address":"somewhere on earth",
//         "city":"sambhal",
//         "country":"india"
//     },
//     "orderItem":{
//         "name":"vivo V29e 5g mobile",
//         "price":15098,
//         "quantity":1,
//         "image":"https://res.cloudinary.com/ecomern/image/upload/v1699696981/qo1d5q5kk1nuj0rx2yhm.jpg",
//         "product":"654f514fff652b1c0238c7f7"
//     },
//     "itemPrice":12568,
//     "tax":5,
//     "shippingCharges":50,
//     "totalAmount":56985
// }









