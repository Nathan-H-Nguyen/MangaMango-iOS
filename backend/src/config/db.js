// Import pg and environment variables
const { Pool } = require('pg');
const { DATABASE_URL, NODE_ENV, PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD} = require('./env');


let config;

// Configure the database connection
if (DATABASE_URL) {
    config = {
        connectionString: DATABASE_URL,
        ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
} else {
    config = {
        host: PG_HOST || 'localhost',
        port: Number(PG_PORT) || 5432,
        database: PG_DB,
        user: PG_USER,
        password: PG_PASSWORD,
        ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
}

// Create a new pool instance
const pool = new Pool(config);

// Handle connection errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Export the pool for use in other modules
module.exports = { pool };