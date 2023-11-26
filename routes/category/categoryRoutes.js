import express from 'express';

import { isAuth } from '../../middlewares/authMiddlewareProfile.js';
import {
    createCategoryController,
    deleteCategoryController,
    getAllCategoryController,
    updateCategoryController
} from '../../controller/category/categoryCongroller.js';
import { isAdmin } from '../../middlewares/admin/admin.js';


const routes = express.Router();




// create category
routes.post('/create', isAuth, isAdmin, createCategoryController)
// get all category
routes.get('/get-all', isAuth, getAllCategoryController)
// delete category
routes.delete('/delete/:id', isAuth, isAdmin, deleteCategoryController)
// update category
routes.put('/update/:id', isAuth, isAdmin, updateCategoryController)


export default routes



