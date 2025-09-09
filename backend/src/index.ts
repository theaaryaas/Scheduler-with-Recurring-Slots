import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { slotsRouter } from './routes/slots';
import knex from 'knex';
import config from './knexfile';

dotenv.config();

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
    // Run database migrations
    console.log('Running database migrations...');
    const environment = process.env.NODE_ENV || 'development';
    const dbConfig = config[environment as keyof typeof config];
    const db = knex(dbConfig);
    
    await db.migrate.latest();
    console.log('Database migrations completed');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
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
