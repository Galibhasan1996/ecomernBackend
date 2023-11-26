import { stripe } from "../../index.js";
import orderModel from "../../models/order/orderModel.js";
import ProductModel from "../../models/productModel/productModel.js";



// create order

export const createOrderController = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItem,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        } = req.body;

        // {
        //     "shippingInfo":"",
        //     "orderItem":"",
        //     "itemPrice":"",
        //     "tax":"",
        //     "shippingCharges":"",
        //     "totalAmount":"",
        // }


        // Validetion

        if (
            !shippingInfo ||
            !orderItem ||
            !itemPrice ||
            !tax ||
            !shippingCharges ||
            !totalAmount
        ) {
            return res.status(500).send({
                success: false,
                Message: 'all fields are  required',
            })
        }
        // create order
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItem,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        })

        // stock update

        for (let index = 0; index < orderItem.length; index++) {
            // find product
            const product = await ProductModel.findById(orderItem[index].product)
            product.stock -= orderItem[index].quantity
            await product.save()
        }
        return res.status(200).send({
            success: true,
            Message: 'order placed successfully',
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            Message: 'Error creating order API .. ',
            error
        })
    }
}

// get all orders

export const getAllOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id })
        // validation
        if (!orders) {
            return res.status(404).send({
                success: false,
                Message: "orders not found"
            })
        }

        // if seccess
        return res.status(200).send({
            success: true,
            Message: "your order data is",
            totalOrder: orders.length,
            orders
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            Message: 'Error GET All order API .. ',
            error
        })
    }
}

// get single order

export const getSingleOrderController = async (req, res) => {
    try {
        const orders = await orderModel.findById(req.params.id)
        // validation
        if (!orders) {
            return res.status(404).send({
                success: false,
                Message: "orders not found"
            })
        }

        // if seccess
        return res.status(200).send({
            success: true,
            Message: "your order data is",
            orders
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
            success: false,
            Message: 'Error GET All order API .. ',
            error
        })
    }
}

// payment

export const paymentController = async (req, res) => {
    try {
        const { payment } = req.body

        if (!payment) {
            return res.status(404).send({
                success: false,
                Message: 'amount is required'
            })
        }

        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(payment) * 100,
            currency: 'usd',
            payment_method_types: ['card']
        })
        return res.status(200).send({
            success: true,
            Message: 'payment successfully',
            client_secret
        })



    } catch (error) {
        return res.status(500).send({
            success: false,
            Message: 'Error in payment API .. ',
            error
        })
    }
}


// for admin


// get all order 


export const getAllAdminOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        // validation
        if (!orders) {
            return res.status(404).send({
                success: false,
                Message: "orders not found"
            })
        }

        // if seccess
        return res.status(200).send({
            success: true,
            Message: "your order data is",
            totalOrder: orders.length,
            orders
        })


    } catch (error) {
        return res.status(500).send({
            success: false,
            Message: 'error in get all admin  API .. ',
            error
        })
    }
}


// change order status 


export const changeOrderStatusController = async (req, res) => {
    try {
        // find product
        const order = await orderModel.findById(req.params.id)
        // validation
        if (!order) {
            return res.status(404).send({
                success: false,
                Message: 'order not found',
            })
        }

        if (order.orderStatus === "processing") {
            order.orderStatus = "shipped"
        }
        else if (order.orderStatus === "shipped") {
            order.orderStatus = "delivered"
            order.deliveredAt = new Date()
            // order.deliveredAt = Date.now() second way
        } else {
            return res.status(500).send({
                success: false,
                Message: 'order already delivered'
            })
        }
        await order.save()

        return res.status(200).send({
            success: true,
            Message: 'order status changed successfully',
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
            success: false,
            Message: 'error in change order status  API .. ',
            error
        })
    }
}