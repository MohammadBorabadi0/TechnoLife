import express from "express";
// routes
import userRoutes from "./UserRoutes.js";
import productRoutes from "./ProductRoutes.js";

const router = express.Router();

// Mount the category and user routes
router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
