import express from "express";
import {
    addFavoriteProduct,
    getFavoriteProducts,
    removeFavoriteProduct,
} from "../controllers/FavoriteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(protect, getFavoriteProducts)
    .post(protect, addFavoriteProduct);
router.delete("/:productId", protect, removeFavoriteProduct);

export default router;
