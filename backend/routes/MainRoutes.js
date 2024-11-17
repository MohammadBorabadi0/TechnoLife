import express from "express";
// routes
import userRoutes from "./UserRoutes.js";
import productRoutes from "./ProductRoutes.js";
import categoryRoutes from "./CategoryRoutes.js";
import brandRoutes from "./BrandRoutes.js";

const router = express.Router();

// Mount the category and user routes
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);

export default router;
