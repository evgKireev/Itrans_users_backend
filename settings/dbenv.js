module.exports = {
  HOST: process.env.DB_HOST || 'localhost',
  DBUSER: process.env.DB_DBUSER || 'root',
  DBPASSWORD: process.env.DB_DBPASSWORD || '8411492z',
  DBNAME: process.env.DB_DBNAME || 'users',
  PORT: process.env.DB_PORT || 3306,
};
