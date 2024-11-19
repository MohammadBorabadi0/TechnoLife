import express from "express";
// routes
import userRoutes from "./UserRoutes.js";
import orderRoutes from "./OrderRoutes.js";
import brandRoutes from "./BrandRoutes.js";
import colorRoutes from "./ColorRoutes.js";
import bannerRoutes from "./BannerRoutes.js";
import productRoutes from "./ProductRoutes.js";
import favoriteRoutes from "./FavoriteRoutes.js";
import categoryRoutes from "./CategoryRoutes.js";

const router = express.Router();

// Mount the category and user routes
router.use("/auth", userRoutes);
router.use("/colors", colorRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/banners", bannerRoutes);
router.use("/products", productRoutes);
router.use("favorites", favoriteRoutes);
router.use("/categories", categoryRoutes);

export default router;
