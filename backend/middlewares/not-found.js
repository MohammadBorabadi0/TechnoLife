const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `مسیر ${req.originalUrl} پیدا نشد.`,
    });
};

export default notFound;
