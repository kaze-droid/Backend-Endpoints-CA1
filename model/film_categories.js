/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/
// Contains endpoints 6 and additional endpoint 1
const db = require('./dbConfig.js');

const film_categories = {
    // Endpoint 6
    getFilmByCategory: (category_id, callback) => {
        const conn = db.getConnection();
        conn.connect((err)=> {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                /*
                category: name
                film: film_id, title, rating, release year, length
                */
                // Film Category <=> Category (category_id)
                // Film Category <=> Film (film_id)

                const sql = 
                `SELECT f.film_id, f.title, c.name AS category, f.rating, f.release_year, f.length AS duration
                FROM film f, category c, film_category fc 
                WHERE fc.category_id = c.category_id AND fc.film_id = f.film_id AND c.category_id = ?;`;
                conn.query(sql,[category_id],(err,res)=> {
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
    // Additional Endpoint 2
    updateCategory: (film_id,category,callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                // Get category_id from category
                const sql1 = `SELECT category_id FROM category WHERE name = ?;`;
                conn.query(sql1,[category],(err1,res1) => {
                    if (err1) {
                        console.log(err1);
                        return callback(err1,null);
                    } else if (res1.length==0) {
                        return callback("Category does not exist",null);
                    } else {
                        const category_id = res1[0].category_id;
                        const sql2 = `UPDATE film_category SET category_id = ? WHERE film_id = ?;`;
                        conn.query(sql2,[category_id,film_id],(err2,res2) => {
                            conn.end();
                            if (err2) {
                                console.log(err2);
                                return callback(err2,null);
                            } else {
                                return callback(null,res2);
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = film_categories;