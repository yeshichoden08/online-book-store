const pgp = require('pg-promise')();
require('dotenv').config(); 

const db = pgp({ 
    host: process.env.DB_HOST || 'localhost',  // Fix: Use logical OR (||)
    port: 5432, 
    database: process.env.DB_NAME || 'online-bookstore',  // Fix
    user: process.env.DB_USER || 'postgres',  // Fix
    password: process.env.DB_PASS || "your_password"  // Fix
}); 

module.exports = db;


