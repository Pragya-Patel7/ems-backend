const ApiError = require("../../../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const Category = require("../model/Category.model");

class CategoryService {
    async getAll() {
        const categories = await Category.query()
            .select("id", "name")
            .where("is_deleted", "=", 0);

        return categories;
    }

    async getById(id) {
        const category = await Category.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!category)
            throw ApiError.notFound("Category not found!");

        return category;
    }

    async updateById(id, data) {
        if ("is_deleted" in data)
            throw ApiError.badRequest("is_deleted action is not allowed!");

        const category = await Category.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!category)
            throw ApiError.notFound("Category not found!");

        const updatedCategory = await Category.query().patchAndFetchById(id, data);

        return updatedCategory;
    }

    async delete(id) {
        const category = await Category.query()
            .findById(id)
            .where("is_deleted", "=", 0);

        if (!category)
            throw ApiError.notFound("Category not found!");

        await Category.query().patchAndFetchById(id, { is_deleted: true });

        return true;
    }

    async create(data) {
        data.id = uuidv4();
        const newCategory = await Category.query().insert(data);

        return newCategory;
    }
}

module.exports = new CategoryService();