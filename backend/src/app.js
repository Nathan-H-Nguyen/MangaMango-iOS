// Import necessary modules
const express = require('express');
const cors = require('cors');

// Import routes and middlewares
const apiRoutes = require('./routes');
const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Use the main API routes under the /api path
app.use('/api', apiRoutes);

// Handle 404 and other errors
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

module.exports = app;