import jwt from "jsonwebtoken";
import User from "../models/User.js";

// User must be authenticated
const protect = async (req, res, next) => {
    let token;

    // Read JWT from the headers
    token = req.headers.authorization.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select("-password");

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            return res.status(401).json({
                success: false,
                message: "توکن منقضی شده یا صحیح نیست",
            });
        }
    } else {
        res.status(401);
        return res
            .status(401)
            .json({ success: false, message: "توکن منقضی شده یا وجود ندارد" });
    }
};

// User must be an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
};

export { protect, admin };
