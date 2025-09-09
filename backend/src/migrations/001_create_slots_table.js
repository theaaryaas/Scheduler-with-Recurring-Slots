exports.up = function(knex) {
  return knex.schema.createTable('slots', function(table) {
    table.increments('id').primary();
    table.integer('day_of_week').notNullable(); // 0 = Sunday, 1 = Monday, etc.
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.date('specific_date').nullable(); // null for recurring, specific date for exceptions
    table.boolean('is_recurring').defaultTo(true);
    table.timestamps(true, true);
    
    // Index for efficient querying
    table.index(['day_of_week', 'is_recurring']);
    table.index(['specific_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('slots');
};
