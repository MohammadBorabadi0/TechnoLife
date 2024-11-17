import express from "express";
const router = express.Router();
import {
    createOrder,
    deleteOrderById,
    getAllOrders,
    getMyOrders,
    getOrderById,
    getOrderByOrderCode,
    updateOrderStatus,
} from "../controllers/OrderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/my").get(protect, getMyOrders);
router.route("/order-detail").get(protect, getOrderByOrderCode);
router.route("/").get(protect, admin, getAllOrders).post(protect, createOrder);
router
    .route("/:id")
    .delete(protect, admin, deleteOrderById)
    .get(getOrderById)
    .put(protect, admin, updateOrderStatus);
// router.route("/:id/delivered").put(updateOrderToDelivered);
// router.route("/:id/returned").put(updateOrderToReturend);

export default router;
