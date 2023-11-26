import express from 'express';

import { isAuth } from '../../middlewares/authMiddlewareProfile.js';
import {
    changeOrderStatusController,
    createOrderController,
    getAllAdminOrdersController,
    getAllOrderController,
    getSingleOrderController,
    paymentController
} from '../../controller/order/ordercontroller.js';
import { isAdmin } from '../../middlewares/admin/admin.js';



const routes = express.Router();

// create order 
routes.post('/create', isAuth, createOrderController)
// get all order 
routes.get('/my-all-order', isAuth, getAllOrderController)

// get single order 
routes.get('/my-single-order/:id', isAuth, getSingleOrderController)
// acceipt payments
routes.post('/payment', isAuth, paymentController)

// for admin
// get all order
routes.get('/admin/get-all-orders', isAuth, isAdmin, getAllAdminOrdersController)
// change order status
routes.put("/admin-order-status/:id", isAuth, isAdmin, changeOrderStatusController)

export default routes