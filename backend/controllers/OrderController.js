import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { calculateOrderPrices } from "../utils/calcPrices.js";
import { generateTrackingNumber } from "../utils/generateTrakingNumber.js";

const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";

        const query = search
            ? {
                  $or: [
                      {
                          "paymentResult.email_address": {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      { orderCode: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const orders = await Order.find(query)
            .populate("user", "id name")
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        return res.status(200).json({
            success: true,
            data: orders,
            page,
            totalPages,
            totalOrders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentResult,
            sendCompany,
        } = req.body;

        // Validate
        if (
            !(
                orderItems &&
                orderItems.length > 0 &&
                shippingAddress &&
                paymentMethod &&
                paymentResult &&
                sendCompany
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "لطفا مقادیر سفارشات و آدرس و شیوه ارسال را وارد کنید",
            });
        }

        const orderItemsWithDetails = await Promise.all(
            orderItems.map(async (item) => {
                const product = await Product.findById(item.product);

                // Increase Order Count
                product.orderCount += 1;
                await product.save();

                return {
                    name: product.name,
                    quantity: item.quantity,
                    image: product.images[0].file,
                    price: item.price,
                    discount: item.discount,
                    color: item.color,
                    product: item.product,
                };
            })
        );

        // Calculate Prices
        const {
            totalPrices,
            totalPricesAfterDiscount,
            totalDiscountAmount,
            shippingCost,
        } = calculateOrderPrices(orderItemsWithDetails);

        // Create the new order
        const newOrder = await Order.create({
            user: req.user._id,
            orderItems: orderItemsWithDetails,
            shippingAddress,
            totalPrices,
            totalDiscountAmount,
            totalPricesAfterDiscount,
            shippingCost,
            paymentMethod,
            sendCompany,
            paymentResult: {
                email_address: req.user.email,
            },
        });

        newOrder.orderCode = `TLC-${newOrder._id.slice(0, 7)}`;
        newOrder.trackingNumber = generateTrackingNumber();

        await newOrder.save();

        await updateOrderToPaid(newOrder._id);

        return res.json({ success: true, data: newOrder });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId }).sort({
            createdAt: -1,
        });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "مشکلی در ارتباط با سرور به وجود آمد" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (order) {
            return res.json({ success: true, data: order });
        } else {
            return res.status(404).json({
                success: false,
                message: "سفارشی با این مشخصات پیدا نشد",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const getOrderByOrderCode = async (req, res) => {
    try {
        const { orderCode } = req.query;
        const order = await Order.findOne({ orderCode }).populate(
            "user",
            "name email"
        );

        if (order) {
            return res.json({ success: true, data: order });
        } else {
            return res.status(404).json({
                success: false,
                message: "سفارشی با این مشخصات پیدا نشد",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "مشکلی در ارتباط با سرور به وجود آمد",
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (status === "delivered") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            if (status === "processing") {
                order.isPaid = true;
                order.paidAt = Date.now();
            }

            if (status === "returned") {
                order.isReturend = true;
                order.returnedAt = Date.now();
            }

            if (status === "canceled and suspended") {
                order.isCanceled = true;
                order.isPaid = false;
                order.isDelivered = false;
                order.canceledAt = Date.now();
            }

            if (status === "awaiting payment") {
                order.isCanceled = false;
                order.isPaid = false;
                order.isDelivered = false;
                order.isReturend = false;
            }

            order.paymentResult.status = status;

            const updatedOrder = await order.save();

            return res.json({
                success: true,
                message: "وضعیت سفارش با موفقیت تغییر کرد",
                data: updatedOrder,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "سفارشی با این مشخصات پیدا نشد",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "مشکلی در ارتباط با سرور به وجود آمد" });
    }
};

const updateOrderToPaid = async (orderId) => {
    try {
        const order = await Order.findById(orderId);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult.status = "processing";

            const updatedOrder = await order.save();

            return updatedOrder;
        } else {
            return res.status(404).json({
                success: false,
                message: "سفارشی با این مشخصات پیدا نشد",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "مشکلی در ارتباط با سرور به وجود آمد" });
    }
};

const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({ _id: id });

    if (!order) {
        return res
            .status(404)
            .json({ success: false, message: "سفارشی با این مشخصات پیدا نشد" });
    }

    return res
        .status(200)
        .json({ success: true, message: "سفارش با موفقیت حذف شد" });
};

export {
    getAllOrders,
    createOrder,
    getMyOrders,
    getOrderById,
    getOrderByOrderCode,
    updateOrderStatus,
    deleteOrderById,
};
