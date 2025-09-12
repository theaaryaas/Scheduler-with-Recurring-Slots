const knex = require('knex');
const config = require('./knexfile');

async function resetMigrations() {
  const environment = process.env.NODE_ENV || 'development';
  const dbConfig = config[environment];
  const db = knex(dbConfig);

  try {
    console.log('Resetting migration state...');
    
    // Drop the migrations table to reset state
    await db.schema.dropTableIfExists('knex_migrations');
    await db.schema.dropTableIfExists('knex_migrations_lock');
    
    console.log('Migration state reset successfully');
  } catch (error) {
    console.error('Error resetting migrations:', error);
  } finally {
    await db.destroy();
  }
}

resetMigrations();
