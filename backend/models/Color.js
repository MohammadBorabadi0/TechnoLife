import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: {
            type: String,
            required: true,
        },
        active: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Color = mongoose.models.Color || mongoose.model("Color", colorSchema);

export default Color;
