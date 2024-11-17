import express from "express";
const router = express.Router();
import {
    getAllColors,
    createColor,
    updateColor,
    getColorById,
    deleteColor,
    updateColorStatus,
} from "../controllers/ColorController.js";
import checkObjectId from "../middlewares/checkObjectId.js";

router.route("/").get(getAllColors).post(createColor);
router.route("/:id").get(getColorById).put(updateColor).delete(deleteColor);
router.route("/:id/status").put(checkObjectId, updateColorStatus);

export default router;
