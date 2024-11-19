import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

const getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";

        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const categories = await Category.find(query).skip(skip).limit(limit);

        const totalCategories = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalCategories / limit);

        return res.status(200).json({
            success: true,
            data: categories,
            page,
            totalPages,
            totalCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findOne({ _id: id });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "دسته بندی با این مشخصات پیدا نشد",
            });
        }

        return res.status(200).json({ success: true, data: category });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, iconUrl, imageUrl } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "نام دسته بندی را وارد کنید",
            });
        }

        const findCategory = await Category.findOne({ name });

        if (findCategory) {
            return res.json({
                success: false,
                message: "دسته بندی با همین نام از قبل وجود دارد",
            });
        }

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "لطفا تصویر دسته بندی را وارد کنید",
            });
        }

        const newCategory = await Category.create({
            name,
            iconUrl,
            imageUrl,
        });

        return res.status(201).json({
            success: true,
            data: newCategory,
            message: "دسته بندی با موفقیت ایجاد شد",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, iconUrl, imageUrl } = req.body;
        const { id } = req.params;

        const existingCategory = await Category.findOne({
            name,
            _id: { $ne: id },
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "دسته بندی با این نام قبلاً ثبت شده است",
            });
        }

        const category = await Category.findOne({ _id: id });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "دسته بندی با این مشخصات پیدا نشد",
            });
        }

        category.name = name || category.name;
        category.imageUrl = imageUrl || category.imageUrl;
        category.iconUrl = iconUrl || category.iconUrl;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "ویرایش با موفقیت انجام شد",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "خطایی در سمت سرور رخ داده است",
        });
    }
};

const updateCategoryStatus = async (req, res) => {
    try {
        const { value } = req.body;

        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "مقدار Id صحیح نیست" });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "دسته بندی با این مشخصات پیدا نشد.",
            });
        }

        category.isActive = value;
        await category.save();

        return res.status(200).json({
            success: true,
            message: "وضعیت دسته بندی با موفقیت ویرایش شد",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد.",
        });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const brandWithCategory = await Brand.findOne({
        "categories.category": id,
    });

    if (brandWithCategory) {
        return res.status(400).json({
            success: false,
            message:
                "این دسته‌بندی در برندها استفاده شده است و نمی‌توان آن را حذف کرد",
        });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "دسته‌بندی با این مشخصات پیدا نشد",
        });
    }

    return res.json({
        success: true,
        message: "دسته‌بندی با موفقیت حذف شد",
        category,
    });
};

export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
};
