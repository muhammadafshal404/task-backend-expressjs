const express = require("express");
const router = express.Router();
const {
  categoryDataValidate,
} = require("../utils/validations/category.validation");
const { categoryController } = require("../controllers");
const {
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory,
} = categoryController;

router.post("/", categoryDataValidate, createCategory);
router.get("/", getCategories);
router.put("/:id", categoryDataValidate, updateCategory);
router.get("/:id", getCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
