import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema
const favoriteProductsSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create the model
const FavoriteProducts = model("FavoriteProducts", favoriteProductsSchema);

export default FavoriteProducts;
