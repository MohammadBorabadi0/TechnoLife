import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // validate
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "لطفا مقادیر نام و ایمیل و رمز عبور را وارد کنید",
            });
        }

        const existsUser = await User.findOne({ email });
        if (existsUser) {
            return res.status(403).json({
                success: false,
                message: "این ایمیل از قبل وجود دارد",
            });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        generateToken(res, newUser._id);

        return res.status(201).json({
            success: true,
            message: "کاربر با موفقیت ایجاد شد",
            data: newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "مقادیر ایمیل و رمز عبور را وارد کنید",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "شما هنوز ثبت نام نکرده اید",
            });
        }

        const comparePassword = bcrypt.compareSync(password, user.password);

        if (!comparePassword) {
            return res
                .status(403)
                .json({ success: false, message: "رمز عبور شما اشتباه است" });
        }

        generateToken(res, user._id);

        return res.status(200).json({
            success: true,
            message: "ورود با موفقیت انجام شد",
            data: user,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";

        const query = search
            ? {
                  $or: [
                      { firstName: { $regex: search, $options: "i" } },
                      { lastName: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } },
                      { mobile: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const users = await User.find(query).skip(skip).limit(limit);

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            data: users,
            page,
            totalPages,
            totalUsers,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربری با این مشخصات پیدا نشد",
            });
        }

        return res.json({ success: true, data: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربری با این مشخصات پیدا نشد",
            });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور بوجود آمد",
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, isAdmin, avatar } = req.body;
        const { id } = req.params;

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربری با این مشخصات پیدا نشد",
            });
        }

        if (!(firstName || lastName || email)) {
            return res.status(400).json({
                success: false,
                message: "لطفا مقادیر ستاره دار را وارد کنید",
            });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.isAdmin = isAdmin;
        user.avatar = avatar || user.avatar || "";

        await user.save();

        return res.status(200).json({
            success: true,
            data: user,
            message: "ویرایش کاربر با موفقیت انجام شد",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور بوجود آمد",
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            mobile,
            email,
            newPassword,
            cardNumber,
            nationalCode,
        } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            user.email = email || user.email;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.mobile = mobile || user.mobile;
            user.cardNumber = cardNumber || user.cardNumber;
            user.nationalCode = nationalCode || user.nationalCode;

            if (newPassword) {
                user.password = newPassword;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                message: "اطلاعات کاربر با موفقیت بروزرسانی گردید.",
                data: {
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    nationalCode: updatedUser.nationalCode,
                    cardNumber: updatedUser.cardNumber,
                },
            });
        } else {
            res.status(404).json({
                success: false,
                message: "کاربری با این مشخصات پیدا نشد",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "کاربری با این مشخصات پیدا نشد",
            });
        }
        return res
            .status(200)
            .json({ success: true, message: "کاربر با موفقیت حذف شد" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور بوجود آمد",
        });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({
            success: true,
            message: "خروج از حساب کاربری با موفقیت انجام شد",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

export {
    createUser,
    loginUser,
    getAllUsers,
    getUserProfile,
    getUserById,
    updateUser,
    updateUserProfile,
    deleteUser,
    logout,
};
