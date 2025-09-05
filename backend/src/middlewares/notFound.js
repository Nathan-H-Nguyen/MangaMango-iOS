// Middleware to handle 404 Not Found errors (for unmatched routes)
module.exports = (req, res, next) => {
    res.status(404).json({ 
        success: false, 
        error: { code: 404, message: 'Not Found' }
    });
}