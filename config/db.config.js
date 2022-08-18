const mysql = require('mysql');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements:true
});

connection.getConnection((err) => {
   if(err){
    console.log(err)
   }else{
    console.log("database connected")
   }
});
console.log(process.env.DB_NAME)

module.exports = connection;