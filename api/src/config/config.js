require('dotenv').config({ path: '../.env' });

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
};


module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
};
