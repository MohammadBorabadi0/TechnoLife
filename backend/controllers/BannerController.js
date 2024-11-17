import Banner from "../models/Banner.js";

const getAllBanners = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";

        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const banners = await Banner.find(query).skip(skip).limit(limit);

        const totalBanners = await Banner.countDocuments(query);
        const totalPages = Math.ceil(totalBanners / limit);

        return res.status(200).json({
            success: true,
            data: banners,
            page,
            totalPages,
            totalBanners,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await Banner.findOne({ _id: id });

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "بنری با این مشخصات پیدا نشد",
            });
        }

        return res.status(200).json({ success: true, data: banner });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const createBanner = async (req, res) => {
    try {
        const { name, url, selectedLocationBanner, imageUrl, mobileImageUrl } =
            req.body;

        const newBanner = new Banner({
            imageUrl,
            mobileImageUrl,
            name,
            url,
            selectedLocationBanner,
        });

        await newBanner.save();
        return res.status(201).json({
            success: true,
            data: newBanner,
            message: "بنر با موفقیت ایجاد شد",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const updateBannerStatus = async (req, res) => {
    try {
        const { value } = req.body;

        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "مقدار Id صحیح نیست" });
        }

        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "بنری با این مشخصات پیدا نشد.",
            });
        }

        banner.isActive = value;
        await banner.save();

        return res.status(200).json({
            success: true,
            message: "وضعیت بنر موردنظر با موفقیت ویرایش شد",
            banner,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد.",
        });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { name, url, selectedLocationBanner, imageUrl, mobileImageUrl } =
            req.body;
        const { id } = req.params;

        const banner = await Banner.findOne({ _id: id });

        if (!banner) {
            return res
                .status(404)
                .json({ success: false, message: "بنر مورد نظر یافت نشد" });
        }

        banner.imageUrl = imageUrl;
        banner.mobileImageUrl = mobileImageUrl;
        banner.name = name || banner.name;
        banner.url = url || banner.url;
        banner.selectedLocationBanner = selectedLocationBanner;
        await banner.save();

        return res.status(201).json({
            success: true,
            data: banner,
            message: "بنر با موفقیت ویرایش شد",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBanner = await Banner.findByIdAndDelete(id);

        if (deletedBanner) {
            return res
                .status(200)
                .json({ success: true, message: "بنر با موفقیت حذف شد" });
        } else {
            return res.status(404).json({
                success: false,
                message: "بنری با این مشخصات پیدا نشد",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succses: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const deleteAllBanners = async (req, res) => {
    try {
        await Banner.deleteMany();
        return res
            .status(200)
            .json({ success: true, message: "همه بنر ها با موفقیت حذف شدند" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

export {
    getAllBanners,
    getBanner,
    createBanner,
    updateBanner,
    updateBannerStatus,
    deleteBanner,
    deleteAllBanners,
};
