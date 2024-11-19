import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";
        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const products = await Product.find(query).skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json({
            success: true,
            data: products,
            page,
            totalPages,
            totalProducts,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred with the server",
        });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.json({ success: true, data: product });
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            brand,
            category,
            images,
            countInStock,
            discount,
            discountTime,
            specifications,
        } = req.body;

        if (!(name || brand || category || images || description)) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields",
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            brand,
            category,
            images,
            countInStock,
            discount,
            discountTime,
            specifications,
        });

        return res.status(201).json({
            success: true,
            data: newProduct,
            message: "Product successfully created",
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Error occurred with the server",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        return res
            .status(200)
            .json({ success: true, message: "Product successfully deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred with the server",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            brand,
            category,
            images,
            countInStock,
            discount,
            discountTime,
            specifications,
        } = req.body;

        const {
            cpu,
            gpu,
            ram,
            os,
            memory,
            screenSize,
            screenType,
            mainCamera,
            selfieCamera,
            battery,
            sensors,
            connectionType,
            bluetooth,
            dimensions,
            weight,
            outputPower,
            simplePhone,
            flagship,
            fiveG,
        } = specifications;

        const findCategory = await Category.findOne({ _id: category });
        const findBrand = await Brand.findOne({ _id: brand });

        const product = await Product.findOne({ _id: req.params.id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.name = name || product.name;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.description = description || product.description;
        product.countInStock = countInStock || product.countInStock;
        product.discount = discount || product.discount;
        product.discountTime = discountTime || product.discountTime;
        product.specifications.battery = battery;
        product.specifications.bluetooth = bluetooth;
        product.specifications.connectionType = connectionType;
        product.specifications.screenSize = screenSize;
        product.specifications.screenType = screenType;
        product.specifications.cpu = cpu;
        product.specifications.gpu = gpu;
        product.specifications.mainCamera = mainCamera;
        product.specifications.selfieCamera = selfieCamera;
        product.specifications.ram = ram;
        product.specifications.os = os;
        product.specifications.memory = memory;
        product.specifications.weight = weight;
        product.specifications.dimensions = dimensions;
        product.specifications.sensors = sensors;
        product.specifications.outputPower = outputPower;
        product.specifications.simplePhone = simplePhone;
        product.specifications.flagship = flagship;
        product.specifications.fiveG = fiveG;
        product.images = images || product.images;

        await product.save();

        return res.status(201).json({
            success: true,
            data: product,
            message: "Product successfully updated",
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Error occurred with the server",
        });
    }
};

const createProductReview = async (req, res) => {
    const { rating, comment, positivePoints, negativePoints } = req.body;

    if (!(rating || comment)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a rating and comment for this product",
        });
    }

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({
                    success: false,
                    message: "You have already reviewed this product.",
                });
            }

            const review = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                rating: Number(rating),
                comment,
                positivePoints,
                negativePoints,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({
                success: true,
                message: "Your review has been successfully added",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred with the server",
        });
    }
};

const updateProductStatus = async (req, res) => {
    try {
        const { value } = req.body;
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Id" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }

        product.isActive = value;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product status successfully updated",
            product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred with the server",
        });
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    createProductReview,
    updateProductStatus,
};
