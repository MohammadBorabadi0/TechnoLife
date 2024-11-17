import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        imageUrl: {
            type: String,
            required: true,
        },
        mobileImageUrl: {
            type: String,
        },
        url: {
            type: String,
            required: true,
        },
        selectedLocationBanner: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default Banner;
