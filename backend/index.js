import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/not-found.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    return res.send("server is running on port " + process.env.PORT ?? 5000);
});

// 404
app.use(notFound);

// errorHandler
app.use(errorHandler);

app.listen(5000, () => {
    console.log("Server is running on port " + process.env.PORT ?? 5000);
});
