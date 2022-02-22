const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database: "saboroso",
    password: "Ehl12345!"
})

module.exports = connection