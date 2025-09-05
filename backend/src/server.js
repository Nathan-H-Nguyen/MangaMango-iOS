// Load environment variables from .env file
require('dotenv').config();

// Import the Express app and database pool
const app = require('./app');
const { pool } = require('./config/db');
const { PORT } = require('./config/env');

let server;
let shuttingDown = false; // Flag to prevent multiple shutdowns

// Start the server and ensure database connectivity
(async () => {
    try {
        // Test database connection
        const { rows } = await pool.query('SELECT NOW() as now');
        console.log('Database connected:', rows[0].now);

        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        
        // Set server timeouts (No clue what this is for)
        server.keepAliveTimeout = 65_000; // 65 seconds
        server.headersTimeout = 66_000; // 66 seconds
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();

// Graceful shutdown with force-quit timer
const shutdown = async (signal) => {
    if (shuttingDown) return; // Prevent multiple shutdowns
    shuttingDown = true;
    
    // Force-quit timer
    const forceQuitTimer = setTimeout(() => {
        console.error('Force quitting after 10 seconds...');
        process.exit(1);
    }, 10000).unref();

    try {
        // Close server and finish existing connections
        console.log(`${signal} received. Shutting down server...`);
        if (server) {
            await new Promise((resolve, reject) => {
                server.close(err => {
                    if (err) return reject(err);
                    resolve();
                });
            });
            console.log('Server closed.');
        }

        // Close database pool
        await pool.end();
        console.log('Database pool closed.');

        clearTimeout(forceQuitTimer);
        console.log('Shutdown complete.');
        process.exit(0);
    } catch (err) {
        clearTimeout(forceQuitTimer);
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

// Handle termination signals
['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => shutdown(signal));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
});