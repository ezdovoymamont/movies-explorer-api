require('dotenv').config();

const { PORT = 3000, JWT_SECRET = 'dev-jwt', DATABASE_NAME = 'mestodb' } = process.env;

const DATABASE_URL = `mongodb://127.0.0.1:27017/${DATABASE_NAME}`;
const JWT_STORAGE_TIME = '7d';

module.exports = {
  PORT,
  JWT_SECRET,
  DATABASE_URL,
  JWT_STORAGE_TIME,
};
