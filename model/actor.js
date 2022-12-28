const e = require('express');
const db = require('./dbConfig.js');

const actorsDB = {
    // Endpoint 1
    getActor: (actor_id, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;';
                conn.query(sql,[actor_id],(err,res) => {
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
    insertActor: (firstname,lastname, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
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
                        console.error(err);
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
                console.error(err);
                return callback(err,null);
            } else {
                const sql = 'DELETE FROM actor WHERE actor_id = ?;';
                conn.query(sql,[id],(err,res)=> {
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
    // Endpoint 6
    getFilmByCategory: (category_id, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.error(err);
                return callback(err, null);
            } else {
                // Category, Film, Film_Category
                const sql = 
                `SELECT f.film_id, f.title, c.name AS category, f.rating, f.release_year, f.length AS duration
                FROM film f, category c, film_category fc 
                WHERE fc.category_id = c.category_id AND fc.film_id = f.film_id AND c.category_id = ?;`;
                conn.query(sql,[category_id],(err,res)=> {
                    conn.end();
                    if (err) {
                        console.error(err);
                        return callback(err, null);
                    } else {
                        return callback(null,res);
                    }
                })
            }
        })
    },
    // Endpoint 7
    getPaymentBtwnDates: (customer_id, start_date, end_date, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.error(err);
                return (err,null);
            } else {
                // Payment <=> Rental (customer_id)
                // Rental <=> Inventory (inventory_id)
                // Inventory <=> Film (film_id)
                const sql =
                `SELECT f.title, p.amount, DATE_FORMAT (p.payment_date, "%Y-%m-%d %H:%i:%s") AS payment_date
                FROM film f, inventory i, rental r, payment p
                WHERE p.customer_id = ? AND r.customer_id = p.customer_id 
                AND i.inventory_id = r.inventory_id AND i.film_id = f.film_id
                AND p.payment_date BETWEEN ? AND ?;`;
                conn.query(sql,[customer_id,start_date,end_date],(err,res)=> {
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
    // Endpoint 8
    insertCustomer: (store_id,first_name,last_name,email,address, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.error(err);
                return (err,null);
            } else {
                const {address_line1,address_line2,district,city_id,postal_code,phone} = address;
                const sql1 = 
                `INSERT into address(address,address2,district,city_id,postal_code,phone)
                VALUES (?,?,?,?,?,?);`;
                conn.query(sql1,[address_line1,address_line2,district,city_id,postal_code,phone], (err1,res1)=> {
                    if (err1) {
                        console.error(err1);
                        return callback(err1,null);
                    } else {
                        const address_id = res1.insertId;
                        const sql2 = `INSERT INTO customer(store_id,first_name,last_name,email,address_id)
                        VALUES (?,?,?,?,?);`;
                        conn.query(sql2,[store_id,first_name,last_name,email,address_id],(err2,res2) => {
                            conn.end();
                            if (err2) {
                                console.error(err2);
                                return callback(err2,null);
                            } else {
                                return callback(null,res2)
                            }
                        });
                    }
                })
            }
        });
    }
}

module.exports = actorsDB;