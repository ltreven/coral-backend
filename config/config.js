exports.dbSettings = {
  db: process.env.DB || 'sys',
  user: process.env.DB_USER || 'ltn',
  pass: process.env.DB_PASS || 'kito001',
  server: process.env.DB_SERVER || '127.0.0.1:3306',
};

exports.serverSettings = {
  port: process.env.PORT || 3000
};
