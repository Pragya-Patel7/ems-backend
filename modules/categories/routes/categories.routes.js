const { getAllCategory, getCategoryById, updateCategory, deleteCategory, createCategory } = require("../controller/categories.controller");

const router = require("express").Router();

router.get("/", getAllCategory)
    .get("/:id", getCategoryById)
    .patch("/:id", updateCategory)
    .delete("/:id", deleteCategory)
    .post("/", createCategory);

module.exports = router;