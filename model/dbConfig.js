const mysql = require('mysql');

const dbConnect = {
    getConnection: function() {
        const conn = mysql.createConnection({
            host: 'localhost',
            user:'root',
            password:'1GetWell!13579',
            database: 'bed_dvd_db'
        });
        return conn
    }
};

module.exports = dbConnect