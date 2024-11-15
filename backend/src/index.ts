import express from "express";
import connectDB from "./db/connect";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Hello from Express!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
