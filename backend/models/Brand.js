import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        categories: [
            {
                category: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category",
                },
                imageUrl: {
                    type: String,
                },
                isActive: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default Brand;
