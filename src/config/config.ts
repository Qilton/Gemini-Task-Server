import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl?: string;
  emailWebhook?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  emailWebhook:process.env.CLERK_EMAIL_WEBHOOK_SECRET
};

export default config;