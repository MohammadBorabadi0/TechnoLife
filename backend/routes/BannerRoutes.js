import express from "express";
import {
    createBanner,
    deleteBanner,
    getAllBanners,
    getBanner,
    deleteAllBanners,
    updateBanner,
    updateBannerStatus,
} from "../controllers/BannerController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import checkObjectId from "../middlewares/checkObjectId.js";

const router = express.Router();

router
    .route("/")
    .get(getAllBanners)
    .post(protect, admin, createBanner)
    .delete(protect, admin, deleteAllBanners);
router
    .route("/:id")
    .delete(protect, admin, deleteBanner)
    .get(protect, admin, getBanner)
    .put(protect, admin, updateBanner);
router.route("/:id/status").put(checkObjectId, updateBannerStatus);

export default router;
