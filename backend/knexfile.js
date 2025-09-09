"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: 'postgresql',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        },
        migrations: {
            directory: './src/migrations'
        },
        seeds: {
            directory: './src/seeds'
        }
    },
    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './src/migrations'
        },
        seeds: {
            directory: './src/seeds'
        }
    }
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map