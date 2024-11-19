import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/not-found.js";
import mainRoutes from "./routes/MainRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

// Enable CORS for both localhost:3000 and localhost:3001
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Use mainRoutes for API endpoints
app.use("/api", mainRoutes);

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
