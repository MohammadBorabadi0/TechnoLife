export const errorHandler = (err, req, res, next) => {
    // Set status code to 500 if it's not already set
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Set the message from the error or default to a generic message
    const message = err.message || "Internal Server Error";

    // Log the error stack in development mode, hide it in production
    const stack = process.env.NODE_ENV === "production" ? null : err.stack;

    // Send the response with status code and message
    res.status(statusCode).json({
        success: false,
        message,
        stack, // Include stack trace in non-production environments
    });
};
