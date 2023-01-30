const mysql = require('mysql2');
const env = require('./dbenv');

const connection = mysql.createConnection({
  host: env.HOST,
  user: env.DBUSER,
  password: env.DBPASSWORD,
  database: env.DBNAME,
  port: env.PORT,
});

connection.connect((error) => {
  if (error) {
    return console.log(`Ошибка подключения к БД ${error}`);
  } else {
    return console.log('Подключение успешно');
  }
});

module.exports = connection;
