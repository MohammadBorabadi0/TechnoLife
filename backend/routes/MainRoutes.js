import express from "express";
// routes
import userRoutes from "./UserRoutes.js";

const router = express.Router();

// Mount the category and user routes
router.use("/users", userRoutes);

export default router;
