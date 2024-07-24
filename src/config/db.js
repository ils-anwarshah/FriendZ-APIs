const mysql = require("mysql2/promise");

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool
  .getConnection()
  .then((result) => {
    result.query(
      "CREATE TABLE IF NOT EXISTS Users (user_id INT NOT NULL AUTO_INCREMENT,fname VARCHAR(40),lname VARCHAR(40),profile_img VARCHAR(1024),dob VARCHAR(12),gender VARCHAR(2),email VARCHAR(40) UNIQUE,mobile_number VARCHAR(12) UNIQUE,location VARCHAR(30),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,about VARCHAR(1024),interest VARCHAR(255), PRIMARY KEY (user_id))"
    );
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION ERR", err);
  });

module.exports = pool;
