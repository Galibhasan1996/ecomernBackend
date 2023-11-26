import colors from 'colors'
import ProductModel from '../../models/productModel/productModel.js';
import { getDataUri } from '../../utils/feature/feature.js';
import cloudinary from 'cloudinary'
import { request } from 'express';


export const getAllproductController = async (req, res) => {
    const { keyword, category } = req.query

    try {
        // validation
        // if (!keyword) {
        //     return res.status(500).send({
        //         status: true,
        //         Message: `please provide a keyword`
        //     });
        // }


        const getAllproduct = await ProductModel.find({
            name: {
                $regex: keyword ? keyword : "",
                $options: "i"
            },
            // category: category ? category : "",
        }).populate('category')

        // if (getAllproduct.length <= 0) {
        //     return res.status(500).send({
        //         status: true,
        //         Message: `add some product`
        //     });
        // }
        return res.status(200).send({
            status: true,
            Message: `get all products successfully`,
            ProductCount: getAllproduct.length,
            getAllproduct
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            error: `problem get all product API ${error}`
        });

    }
}

// get top

export const getTopProductController = async (req, res) => {
    try {
        const topProducts = await ProductModel.find({}).sort({ rating: -1 }).limit(3).exec();


        if (!topProducts) {
            return res.status(404).send({
                success: false,
                error: "top products not found",
            });
        }

        if (topProducts.length === 0) {
            return res.status(404).send({
                success: false,
                error: "lenth product not found",
            });
        }


        return res.status(200).send({
            success: true,
            message: "Top 3 products",
            topProduct: topProducts.length,
            topProducts,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching top products",
            error,
        });
    }
};




export const getSingleProductController = async (req, res) => {


    try {
        const product = await ProductModel.findById(req.params.id)

        if (!product) {
            return res.status(404).send({
                status: false,
                Message: `product not found`
            });
        }
        return res.status(200).send({
            status: true,
            Message: `product found`,
            product
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(500).send({
                status: false,
                error: `invalid id`
            });
        }

        return res.status(500).send({
            status: false,
            error: `problem get single product API ${error}`
        });

    }
}

// create product controller

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, stock, category, quantity } = req.body
        if (!name || !description || !price || !stock || !category || !quantity) {
            return res.status(500).send({
                status: false,
                error: `all fields are required`
            });
        }
        // {
        //     "name":"",
        //         "description":"",
        //         "price":"",
        //         "stock":"",
        //         "category":"",
        // }
        if (!req.file) {
            return res.status(500).send({
                status: false,
                error: `please select image`
            });
        }
        const file = getDataUri(req.file)

        const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cloudinaryDB.public_id,
            url: cloudinaryDB.secure_url
        }
        const createProducte = await ProductModel.create({
            name, description, price, stock, category, quantity, images: [image]
        })

        return res.status(200).send({
            status: true,
            Message: `product create successfully`,
            createProducte
        });

    } catch (error) {

        return res.status(500).send({
            status: false,
            error: `problem create product API ${error}`
        });

    }
}



// update product  controller


export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, stock, category, } = req.body
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                Message: "Product not found"
            })
        }


        if (name) { product.name = name; }
        if (description) { product.description = description; }
        if (price) { product.price = price; }
        if (stock) { product.stock = stock; }
        if (category) { product.category = category; }

        await product.save();

        return res.status(200).send({
            status: true,
            Message: `Product updated successfully`
        });


    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                status: false,
                error: `invalid id`
            });
        }

        return res.status(500).send({
            status: false,
            error: `Problem updateProduct API ${error}`
        });
    }
}



export const updateProductImageController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                Message: "Product image not found"
            })
        }

        if (!req.file) {
            return res.status(404).send({
                success: false,
                Message: "Product not found"
            })
        }


        const file = getDataUri(req.file)

        const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content)

        const image = {
            public_id: cloudinaryDB.public_id,
            url: cloudinaryDB.secure_url
        }

        product.images.push(image)
        await product.save()


        return res.status(200).send({
            status: true,
            Message: `product image update successfully`,
        });


    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                status: false,
                error: `invalid id`
            });
        }

        return res.status(500).send({
            status: false,
            error: `Problem updateProduct API ${error}`
        });
    }
}




export const deleteProductImageController = async (req, res) => {
    try {

        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                Message: "Product image not found"
            })
        }

        // find image id

        const id = req.query.id

        if (!id) {
            return res.status(404).send({
                success: false,
                Message: "Product image not found in ID"
            })
        }

        let isExist = -1

        product.images.forEach((item, index) => {
            if (item.id.toString() === id.toString()) {
                isExist = index
            }
            if (isExist < 0) {
                return res.status(404).send({
                    success: false,
                    Message: "image not found",
                    index: index,
                    Message: "im foreach loop error"
                })
            }
        })


        // delete image try 
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        product.images.splice(isExist, 1)
        await product.save()

        return res.status(200).send({
            success: true,
            Message: "product image deleted successfully",
        })


    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                status: false,
                error: `invalid id`
            });
        }

        return res.status(500).send({
            status: false,
            error: `Problem delete Product image API ${error}`
        });
    }
}



// delete product 

export const deleteProductController = async (req, res) => {
    try {

        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                Message: "Product not found"
            })
        }

        // find image and delete entire product cloudinary
        for (let index = 0; index < product.images.length; index++) {
            console.log(index);
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }

        await product.deleteOne()

        return res.status(200).send({
            success: true,
            Message: "Product deleted successfully"
        })


    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                status: false,
                error: `invalid id`
            });
        }

        return res.status(500).send({
            status: false,
            error: `error in delete entire Product API ${error}`
        });
    }
}




// create product review and comment

export const productReviewController = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        // find product 

        const product = await ProductModel.findById(req.params.id)

        // checking review
        const alreadyReview = product.reviews.find((item) => {
            return item.user.toString() === req.user._id.toString()
        })
        // validation alreadyReview
        if (alreadyReview) {
            return res.status(400).send({
                success: false,
                Message: "Product Already Review"
            })
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment: comment,
            user: req.user._id
        }
        // create review
        product.reviews.push(review)
        // numReviews
        product.numReviews = product.reviews.length
        // rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        // save 
        await product.save()
        return res.status(200).send({
            status: true,
            Message: `Review created successfully`
        });


    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                status: false,
                error: `invalid id`
            });
        }

        return res.status(500).send({
            status: false,
            error: `error in review and comments API ${error}`
        });
    }
}



