import mongoose from "mongoose";

// review model 
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        lowercase: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'user is required'],
    }
}, { timestamps: true })






const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name is required'],

    },
    description: {
        type: String,
        required: [true, 'product description is required'],
        trim: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'product price is required']
    },
    stock: {
        type: Number,
        required: [true, 'product stock is required']
    },
    quantity: {
        type: Number,
        required: [true, 'product quantity is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        trim: true,
        lowercase: true
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }


}, { timestamps: true })



const ProductModel = mongoose.model("Porducts", productSchema)

export default ProductModel





