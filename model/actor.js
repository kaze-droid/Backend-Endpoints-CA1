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
                const sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;';
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
                const sql = 'SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?;';
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
    insertActor: (firstname, lastname, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'INSERT INTO actor (first_name, last_name) VALUES (?,?);';
                conn.query(sql,[firstname,lastname],(err,res)=> {
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
    // Endpoint 4
    updateActor: (firstname, lastname, id, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const [sql,param] = (firstname && lastname) ? ['UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?;', [firstname,lastname,id]] : 
                (firstname ? ['UPDATE actor SET first_name = ? WHERE actor_id = ?;', [firstname,id]] : 
                (lastname ? ['UPDATE actor SET last_name = ? WHERE actor_id = ?;',[lastname,id]]: ''));
                conn.query(sql,param,(err,res)=> {
                    conn.end();
                    if (err) {
                        console.error(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                })
            }
        });
    },
    // Endpoint 5
    deleteActor: (id, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'DELETE FROM actor WHERE actor_id = ?;'
                conn.query(sql,[id],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.error(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                })
            }
        });

    }
}

module.exports = actorsDB;