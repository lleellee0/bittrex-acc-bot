exports.module = {
  connectionLimit: 100,
  host: process.env.DB_HOST_IP ? process.env.DB_USER_NAME : 'localhost',
  user: process.env.DB_USER_NAME ? process.env.DB_USER_NAME : 'root',
  password: process.env.DB_USER_PASSWORD ? process.env.DB_USER_PASSWORD : 'mysql123',
  database: 'bittrex_acc_bot'
};
