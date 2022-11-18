const db = require('./dbConfig.js');

const actorsDB = {
    // endpoint 1
    getActor: (actorid, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'SELECT * FROM actor WHERE actor_id = ?';
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
                const sql = 'SELECT * FROM actor ORDER BY first_name LIMIT ? OFFSET ?';
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
    }
}

module.exports = actorsDB;