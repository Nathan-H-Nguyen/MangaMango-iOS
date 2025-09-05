module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const payload = {
        success: false,
        error: {
            code: statusCode,
            message: message,
        },
    };

    // Include stack trace in development mode for easier debugging
    if (process.env.NODE_ENV === 'development') {
        payload.error.stack = err.stack;
    }

    res.status(statusCode).json(payload);
}