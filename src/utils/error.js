export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // Multer errors (file upload)
    if (err.name === 'MulterError') {
        err.statusCode = 400;
        if (err.code === 'LIMIT_FILE_SIZE') {
            err.message = 'Payment screenshot is too large (max 5MB).';
        }
    }

    // Custom upload filter errors (e.g., non-image upload)
    if (typeof err.message === 'string' && err.message.toLowerCase().includes('only image files are allowed')) {
        err.statusCode = 400;
    }

    // Handle specific Express/MongoDB errors (Optional)
    if (err.name === "CastError") {
        err.message = `Resource not found. Invalid: ${err.path}`;
        err.statusCode = 400;
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        // Include stack trace only in development mode
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};