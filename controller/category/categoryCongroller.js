import categoryModel from "../../models/categoryModel/categoryModel.js";
import ProductModel from "../../models/productModel/productModel.js";



// create category
export const createCategoryController = async (req, res) => {
    try {
        const { category } = req.body

        if (!category) {
            return res.status(404).send({
                success: false,
                Message: "category name is required",
            })
        }
        const createCategory = await categoryModel.create({
            category: category
        })
        return res.status(200).send({
            success: true,
            Message: `${category} category created successfully`,
            createCategory
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            Message: "error in category API..",
            error: error
        })
    }
}

// get all category

export const getAllCategoryController = async (req, res) => {

    try {
        const getAllCategory = await categoryModel.find({})

        return res.status(200).send({
            success: true,
            Message: "get all category successfully",
            totalCategory: getAllCategory.length,
            getAllCategory
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            Message: "error in get all category API..",
            error: error
        })
    }
}

// delete category

export const deleteCategoryController = async (req, res) => {
    try {
        // find category
        const category = await categoryModel.findById(req.params.id)

        if (!category) {
            return res.status(404).send({
                seccess: false,
                Message: "category not found"
            })
        }

        // find product with this category id
        const products = await ProductModel.find({ category: category._id })
        // update product category
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            product.category = undefined
            await product.save()
        }
        await category.deleteOne()

        return res.status(200).send({
            success: true,
            Message: "delete category successfully",
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
            Message: "error in delete category API..",
            error: error
        })
    }
}



// update category

export const updateCategoryController = async (req, res) => {
    try {
        const { updatedCategory } = req.body

        // find category
        const category = await categoryModel.findById(req.params.id)

        if (!category) {
            return res.status(404).send({
                seccess: false,
                Message: "category not found"
            })
        }

        // find product with this category id
        const products = await ProductModel.find({ category: category._id })
        // update product category
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            product.category = updatedCategory
            await product.save()
        }
        if (updatedCategory) {
            category.category = updatedCategory
        }


        await category.save()
        return res.status(200).send({
            success: true,
            Message: `update category successfully ... `,
            category
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
            Message: "error in update category API ...",
            error: error
        })
    }
}


