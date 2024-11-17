import express from "express";
const router = express.Router();

import {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
    updateCategoryStatus,
    getCategoryById,
} from "../controllers/CategoryController.js";

router.route("/").get(getCategories).post(createCategory);
router
    .route("/:id")
    .put(updateCategory)
    .delete(deleteCategory)
    .get(getCategoryById);
router.route("/:id/status").put(updateCategoryStatus);

export default router;
