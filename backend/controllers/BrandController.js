import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const getBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";

        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const brands = await Brand.find(query).skip(skip).limit(limit);

        const totalBrands = await Brand.countDocuments(query);
        const totalPages = Math.ceil(totalBrands / limit);

        return res.status(200).json({
            success: true,
            data: brands,
            page,
            totalPages,
            totalBrands,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findOne({ _id: id });

        if (!brand) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "برند با این مشخصات پیدا نشد",
                });
        }

        return res.status(200).json({ success: true, data: brand });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "مشکلی در ارتباط با سرور به وجود آمد",
            });
    }
};

const createBrand = async (req, res) => {
    try {
        const { name, categories } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "نام برند مورد نظر را وارد کنید ",
            });
        }

        const findBrand = await Brand.findOne({ name });

        if (findBrand) {
            return res.json({
                success: false,
                message: "برند با همین نام از قبل وجود دارد",
            });
        }

        const brand = new Brand({ name });

        for (const item of categories) {
            const { category: categoryId, imageUrl } = item;

            let existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                existingCategory = await Category.create({
                    _id: categoryId,
                });
            }

            brand.categories.push({
                category: existingCategory._id,
                imageUrl,
                showInHomePage: item.showInHomePage || false,
            });
        }

        await brand.save();

        return res.json({
            success: true,
            data: brand,
            message: "برند با موفقیت ایجاد شد",
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json("مشکلی بوجود آمده است. لطفا دوباره امتحان کنید.");
    }
};

const updateBrand = async (req, res) => {
    try {
        const { categories, name } = req.body;
        const { id: brandId } = req.params;

        const brand = await Brand.findOne({ _id: brandId });
        if (!brand) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "برند با این مشخصات پیدا نشد",
                });
        }

        for (const cat of categories) {
            const categoryExists = await Category.findOne({
                _id: cat.category,
            });
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: `دسته بندی با این مشخصات ${cat.category} پیدا نشد`,
                });
            }
        }

        brand.name = name || brand.name;
        brand.categories = categories;

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "ویرایش برند با موفقیت انجام شد",
            data: brand,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                error.message ||
                "هنگام ویرایش برند مشکلی به وجود آمد لطفا مجددا تلاش کنید",
        });
    }
};

const deleteBrand = async (req, res) => {
    const { id: brandId } = req.params;

    const brand = await Brand.findById(brandId);

    if (!brand) {
        return res.status(404).json({
            success: false,
            message: "برند یافت نشد",
        });
    }

    const productCount = await Product.countDocuments({ brand: brandId });

    if (productCount > 0) {
        return res.status(400).json({
            success: false,
            message:
                "این برند در یکی از محصولات استفاده شده است و نمی‌توان آن را حذف کرد.",
        });
    }

    await Brand.findByIdAndDelete(brandId);

    return res.json({
        success: true,
        message: "برند با موفقیت حذف شد",
    });
};

export { getBrands, getBrandById, createBrand, updateBrand, deleteBrand };
