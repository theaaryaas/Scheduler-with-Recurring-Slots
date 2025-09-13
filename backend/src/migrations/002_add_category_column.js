exports.up = function(knex) {
  return knex.schema.alterTable('slots', function(table) {
    table.string('category').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('slots', function(table) {
    table.dropColumn('category');
  });
};
