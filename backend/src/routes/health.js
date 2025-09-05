const router = require('express').Router();
const { pool } = require('../config/db');

// Health check endpoint
router.get('/', async (req, res) => {
    try {
        // Simple query to check database connectivity
        await pool.query('SELECT NOW() as now');
        res.status(200).json({ success: true, message: 'OK' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ success: false, error: { code: 500, message: 'Internal Server Error' } });
    }
});

module.exports = router;