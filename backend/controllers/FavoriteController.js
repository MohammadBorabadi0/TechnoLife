import FavoriteProducts from "../models/Favorites.js";
import Product from "../models/Product.js";

/**
 * Get the list of user's favorite products
 * @route GET /api/favorites
 * @access Private
 */
export const getFavoriteProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const favorites = await FavoriteProducts.findOne({
            user: req.user._id,
        });

        // Filter products based on favorites
        const favoriteProductIds = favorites.products.map((fav) =>
            fav.product.toString()
        );
        const favoriteProducts = products.filter((product) =>
            favoriteProductIds.includes(product._id.toString())
        );

        return res.status(200).json({ success: true, data: favoriteProducts });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

/**
 * Add a product to the user's favorite list
 * @route POST /api/favorites
 * @access Private
 */
export const addFavoriteProduct = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    try {
        // Check if the user already has a favorites list
        let favorite = await FavoriteProducts.findOne({ user: userId });

        if (favorite) {
            // Check if the product is already in the list
            const isProductExists = favorite.products.some(
                (item) => item.product.toString() === productId
            );

            if (isProductExists) {
                return res.status(400).json({
                    success: false,
                    message: "این محصول از قبل در لیست علاقه مندی ها وجود دارد",
                });
            }

            // Add the product to the existing list
            favorite.products.push({ product: productId });
        } else {
            // Create a new favorites list for the user
            favorite = new FavoriteProducts({
                user: userId,
                products: [{ product: productId }],
            });
        }

        await favorite.save();
        res.status(201).json({
            success: true,
            message: "محصول موردنظر به لیست علاقه مندی ها اضافه شد",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Remove a product from the user's favorite list
 * @route DELETE /api/favorites/:productId
 * @access Private
 */
export const removeFavoriteProduct = async (req, res) => {
    const userId = req.user._id; // Assuming authentication middleware provides the user object
    const { productId } = req.params;

    try {
        const favorite = await FavoriteProducts.findOne({ user: userId });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "محصولی با این مشخصات در لیست علاقه مندی ها پیدا نشد",
            });
        }

        // Filter out the product from the list
        const updatedProducts = favorite.products.filter(
            (item) => item.product.toString() !== productId
        );

        if (updatedProducts.length === favorite.products.length) {
            return res.status(404).json({
                success: false,
                message: "محصولی با این مشخصات در لیست علاقه مندی ها پیدا نشد",
            });
        }

        favorite.products = updatedProducts;
        await favorite.save();
        res.status(200).json({
            success: true,
            message: "Product removed from favorites",
            favorite,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
