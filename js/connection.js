const mysql = require("mysql");

function connect() {

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;
    init();
    // console.log("connected as id " + connection.threadId + "\n");
});
return connection;
}
module.exports = connect;