import express from 'express';
import {
    createProductController,
    deleteProductController,
    deleteProductImageController,
    getAllproductController,
    getSingleProductController,
    getTopProductController,
    productReviewController,
    updateProductController,
    updateProductImageController
} from '../../controller/productController/productController.js';

import { isAuth } from '../../middlewares/authMiddlewareProfile.js';
import { singleUpload } from '../../middlewares/multer.js';
import { isAdmin } from '../../middlewares/admin/admin.js';


const routes = express.Router();

// {
//     "name":"Mohammad Galib",
//     "email":"Galibhasan1995@gmail.com",
//     "password":"123456",
//     "address":"somewhere on earth",
//     "city":"hazrat nagar garhi",
//     "country":"india",
//     "phone":"9368489165",
//     "role":"admin"
//     }


// get all product
routes.get('/get-all', getAllproductController)
// get one Product
routes.get('/:id', getSingleProductController)

// create product

routes.post('/create', isAuth, isAdmin, singleUpload, createProductController)

// update product
routes.put('/:id', isAuth, isAdmin, updateProductController)

// update product image
routes.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageController)
// delete product image
routes.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController)
// delete product
routes.delete('/delete/:id', isAuth, isAdmin, deleteProductController)
// review product
routes.put("/review/:id", isAuth, productReviewController)
// top produt
routes.get('/getTop', isAuth, getTopProductController)


export default routes