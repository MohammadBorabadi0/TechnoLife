import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
import {
    getBrands,
    createBrand,
    deleteBrand,
    getBrandById,
    updateBrand,
} from "../controllers/BrandController.js";

router.route("/").get(getBrands).post(protect, createBrand);
router
    .route("/:id")
    .delete(protect, deleteBrand)
    .get(getBrandById)
    .put(protect, updateBrand);

export default router;
