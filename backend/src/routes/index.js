// Main router file to aggregate all routes
const express = require('express');
const router = express.Router();

// Import individual route files
const healthRoute = require('./health');

// Mount and use imported routes under their Base Paths
router.use('/health', healthRoute);

// Export the aggregated router
module.exports = router;