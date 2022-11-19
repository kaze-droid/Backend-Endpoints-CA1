const db = require('./dbConfig.js');

const actorsDB = {
    // Endpoint 1
    getActor: (actorid, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?';
                conn.query(sql,[actorid],(err,res) => {
                    conn.end();
                    if (err) {
                        console.error(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        });
    },
    // Endpoint 2
    listActors: (limit,offset,callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?';
                conn.query(sql,[limit,offset],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.error(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        });
    },
    // Endpoint 3
    insertActor: (firstname, lastname, last_update, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'INSERT INTO actor (first_name, last_name, last_update) VALUES (?,?,?)';
                conn.query(sql,[firstname,lastname, last_update],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.error(err);
                        return callback(err,null);
                    } else {
                        if (res.affectedRows == 1) {

                        }
                        return callback(null,res);
                    }
                });
            }
        });
    }
}

module.exports = actorsDB;