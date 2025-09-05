const z = require('zod');
const { en } = require('zod/v4/locales');

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Hosted DB URL
  DATABASE_URL: z.url().optional(),

  // Local/Postgres Container DB settings
  PG_HOST: z.string().optional(),
  PG_PORT: z.coerce.number().optional(),
  PG_DB: z.string().optional(),
  PG_USER: z.string().optional(),
  PG_PASSWORD: z.string().optional(),

  // Base URL for external API
  BASE_URL: z.url().default('https://mangadex.org/'),
});

// Load environment variables from .env file
const parsed = envSchema.safeParse(process.env);

// If validation fails, log the errors and exit
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

// Export the validated environment variables
module.exports = parsed.data;