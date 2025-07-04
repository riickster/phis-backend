const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

module.exports = db;