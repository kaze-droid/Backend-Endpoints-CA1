/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/
// Contains endpoints 1 to 5
const db = require('./dbConfig.js');

const actors = {
    // Endpoint 1
    getActor: (actor_id, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;';
                conn.query(sql,[actor_id],(err,res) => {
                    conn.end();
                    if (err) {
                        console.log(err);
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
                console.log(err);
                return callback(err,null);
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?;';
                conn.query(sql,[limit,offset],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        });
    },
    // Endpoint 3
    insertActor: (firstname,lastname, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const sql = 'INSERT INTO actor (first_name, last_name) VALUES (?,?);';
                conn.query(sql,[firstname,lastname],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.log(err);
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
                console.log(err);
                return callback(err,null);
            } else {
                let sql,param;
                // If both are defined
                if (firstname && lastname) {
                    sql = `UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?;`;
                    param = [firstname,lastname,id];
                // If only firstname is defined
                } else if (firstname) {
                    sql = `UPDATE actor SET first_name = ? WHERE actor_id = ?;`;
                    param = [firstname,id];
                // If only lastname is defined
                } else if (lastname) {
                    sql = `UPDATE actor SET last_name = ? WHERE actor_id = ?;`;
                    param = [lastname,id];
                }
                conn.query(sql,param,(err,res)=> {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        });
    },
    // Endpoint 5
    deleteActor: (id, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const sql = 'DELETE FROM actor WHERE actor_id = ?;';
                conn.query(sql,[id],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null,res);
                    }
                });
            }
        });
    }
}

module.exports = actors;