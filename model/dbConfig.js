const mysql = require('mysql');

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