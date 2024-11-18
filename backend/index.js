import express from "express";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
import notFound from "./middlewares/not-found.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// 404
app.use(notFound);

// errorHandler
app.use(errorHandler);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
