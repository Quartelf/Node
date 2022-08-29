const mysql = require("mysql");

const connect = () => {
    return mysql.createConnection({
        host: 'localhost',
        database: 'malwee',
        user: 'root',
        password: 'root'
    });
}

exports.connect = connect;