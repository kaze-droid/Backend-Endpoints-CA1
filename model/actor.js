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
    insertActor: (firstname, lastname, last_update, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'INSERT INTO actor (first_name, last_name, last_update) VALUES (?,?,?);';
                conn.query(sql,[firstname,lastname, last_update],(err,res)=> {
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
    updateActor: (firstname, lastname, last_update, id, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const [sql,param] = (firstname && lastname) ? ['UPDATE actor SET first_name = ?, last_name = ?, last_update = ? WHERE actor_id = ?;', [firstname,lastname,last_update,id]] : 
                (firstname ? ['UPDATE actor SET first_name = ?, last_update = ? WHERE actor_id = ?;', [firstname,last_update,id]] : 
                (lastname ? ['UPDATE actor SET last_name = ?, last_update = ? WHERE actor_id = ?;',[lastname,last_update,id]]: ''));
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