import express from "express";
const router = express.Router();
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    createProductReview,
    updateProductStatus,
} from "../controllers/ProductController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import checkObjectId from "../middlewares/checkObjectId.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

router
    .route("/:id")
    .get(checkObjectId, getProductById)
    .delete(protect, admin, checkObjectId, deleteProduct)
    .put(protect, admin, checkObjectId, updateProduct);

router
    .route("/:id/status")
    .put(protect, admin, checkObjectId, updateProductStatus);

export default router;
