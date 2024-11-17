import Color from "../models/Color.js";

const getAllColors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";

        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { code: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const colors = await Color.find(query).skip(skip).limit(limit);

        const totalColors = await Color.countDocuments(query);
        const totalPages = Math.ceil(totalColors / limit);

        return res.status(200).json({
            success: true,
            data: colors,
            page,
            totalPages,
            totalColors,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getColorById = async (req, res) => {
    try {
        const { id } = req.params;

        const color = await Color.findOne({ _id: id });
        if (!color) {
            return res.status(404).json({
                success: false,
                message: "رنگ با این مشخصات پیدا نشد",
            });
        }

        return res.status(200).json({ success: true, data: color });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const createColor = async (req, res) => {
    try {
        const { name, code } = req.body;
        const newColor = Color.create({
            name,
            code,
        });
        return res.status(201).json({
            success: true,
            data: newColor,
            message: `رنگ موردنظر با موفقیت ایجاد شد`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const updateColor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        const color = await Color.findOne({ _id: id });

        if (!color) {
            return res.status(404).json({
                success: false,
                message: "رنگی با این مشخصات پیدا نشد",
            });
        }

        color.name = name || color.name;
        color.code = code || color.code;

        await color.save();

        return res.status(200).json({
            success: true,
            data: color,
            message: `رنگ موردنظر با موفقیت ویرایش شد`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور بوجود آمد",
        });
    }
};

const updateColorStatus = async (req, res) => {
    try {
        const { value } = req.body;

        console.log("value", value);
        console.log("req.body", req.body);

        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "مقدار Id صحیح نیست" });
        }

        const color = await Color.findById(id);

        if (!color) {
            return res.status(404).json({
                success: false,
                message: "رنگی با این مشخصات پیدا نشد.",
            });
        }

        color.active = value;
        await color.save();

        return res.status(200).json({
            success: true,
            message: "وضعیت رنگ با موفقیت ویرایش شد",
            color,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد.",
        });
    }
};

const deleteColor = async (req, res) => {
    try {
        const { id } = req.params;

        const color = await Color.findOne({ _id: id });

        if (!color) {
            return res.status(404).json({
                success: false,
                message: "رنگ با این مشخصات پیدا نشد",
            });
        }

        await Color.deleteOne({ _id: id });

        return res
            .status(200)
            .json({ success: true, message: "رنگ با موفقیت حذف شد" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

export {
    getAllColors,
    getColorById,
    createColor,
    updateColor,
    updateColorStatus,
    deleteColor,
};
