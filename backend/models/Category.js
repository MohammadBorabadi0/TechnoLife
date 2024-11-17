import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: { type: String },
    items: [{ type: String }],
});

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        iconUrl: { type: String, required: true },
        imageUrl: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        subCategories: [subCategorySchema],
    },
    { timestamps: true }
);

const Category =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
