import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { slotsRouter } from './routes/slots';
import knex from 'knex';
import config from './knexfile';
import path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Set environment variables explicitly for development
if (process.env.NODE_ENV !== 'production') {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.nxssvrmabftmdlcckoqx:07SEP2001aa!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';
  process.env.PORT = process.env.PORT || '3001';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/slots', slotsRouter);

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    // Skip database migrations for local testing without DB
    if (process.env.SKIP_DB === 'true' || process.env.SKIP_DB === 'false') {
    } else {
      // Run database migrations
      const environment = process.env.NODE_ENV || 'development';
      const dbConfig = config[environment as keyof typeof config];
      const db = knex(dbConfig);
      
      try {
        await db.migrate.latest();
      } catch (error) {
        console.error('Migration error (continuing anyway):', error instanceof Error ? error.message : String(error));
        // Continue even if migrations fail (table might already exist)
      } finally {
        await db.destroy();
      }
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (error: any) => {
      console.error('Server failed to start:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
