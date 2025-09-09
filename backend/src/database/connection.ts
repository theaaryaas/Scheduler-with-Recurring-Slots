import knex from 'knex';
import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment as keyof typeof config];

export const db = knex(dbConfig);
