const ApiError = require("../../../utils/apiError");
const Response = require("../../../utils/response");
const CategoryService = require("../services/categories.service");

const getAllCategory = async (req, res) => {
    try {
        const categories = await CategoryService.getAll();

        const result = {
            categories: categories
        }

        return Response.success(res, "Categories found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const getCategoryById = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Category id is required!");
    try {
        const category = await CategoryService.getById(id);

        const result = {
            category: category
        }

        return Response.success(res, "Category found successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const updateCategory = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Category id is required!");
    
    const data = req.body;
    if (!data) throw ApiError.badRequest("Enter update inputs");
    try {
        const updatedCategory = await CategoryService.updateById(id, data);

        const result = {
            category: updatedCategory
        }

        return Response.success(res, "Category updated successfully!", result);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const deleteCategory = async (req, res) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest("Category id is required!");
    
    try {
        const deleteCategory = await CategoryService.delete(id);

        return Response.success(res, "Category deleted successfully!", deleteCategory);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

const createCategory = async (req, res) => {
    const data = req.body;
    try {
        const newCategory = await CategoryService.create(data);

        return Response.success(res, "Category create successfully!", newCategory);
    } catch (err) {
        if (err instanceof ApiError)
            return Response.error(res, err);

        return Response.error(res, ApiError.internal(err));
    }
}

module.exports = {
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    createCategory
}