/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const mysql = require('mysql');

// username for accessing the database is bed_dvd_root
// password for accessing the database is pa$$woRD123

const dbConnect = {
    getConnection: function() {
        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'bed_dvd_root',
            password: 'pa$$woRD123',
            database: 'bed_dvd_db'
        });
        return conn;
    }
};

module.exports = dbConnect;