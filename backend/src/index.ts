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
    // Run database migrations
    const environment = process.env.NODE_ENV || 'development';
    const dbConfig = config[environment as keyof typeof config];
    const db = knex(dbConfig);
    
    try {
      console.log('Running database migrations...');
      console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
      
      const [batchNo, log] = await db.migrate.latest();
      console.log('✅ Migrations completed successfully. Batch:', batchNo);
      console.log('Migration log:', log);
      
      // Verify slots table exists and has correct structure
      const hasTable = await db.schema.hasTable('slots');
      if (hasTable) {
        const columns = await db('slots').columnInfo();
        console.log('✅ Slots table exists with columns:', Object.keys(columns));
        
        // Check if category column exists
        if (columns.category) {
          console.log('✅ Category column exists');
        } else {
          console.log('❌ Category column missing - adding it now');
          await db.schema.alterTable('slots', function(table) {
            table.string('category').nullable();
          });
          console.log('✅ Category column added');
        }
      } else {
        console.log('❌ Slots table does not exist - creating it now');
        await db.schema.createTable('slots', function(table) {
          table.increments('id').primary();
          table.integer('day_of_week').notNullable();
          table.time('start_time').notNullable();
          table.time('end_time').notNullable();
          table.date('specific_date').nullable();
          table.boolean('is_recurring').defaultTo(true);
          table.string('category').nullable();
          table.timestamps(true, true);
          
          table.index(['day_of_week', 'is_recurring']);
          table.index(['specific_date']);
        });
        console.log('✅ Slots table created');
      }
      
    } catch (error) {
      console.error('❌ Migration error:', error instanceof Error ? error.message : String(error));
      console.error('Full migration error:', error);
      // Continue even if migrations fail (table might already exist)
    } finally {
      await db.destroy();
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
