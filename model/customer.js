/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/
// Contains endpoints 7 and 8

const db = require('./dbConfig.js');

const customer = {
    // Endpoint 7
    getPaymentBtwnDates: (customer_id, start_date, end_date, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                /*
                film: title
                payment: amount, payment_date
                */
                // Payment <=> Rental (customer_id)
                // Rental <=> Inventory (inventory_id)
                // Inventory <=> Film (film_id)

                let sql, params;
                // If both dates are defined
                if (start_date && end_date) {
                    sql =
                    `SELECT f.title, p.amount, DATE_FORMAT (p.payment_date, "%Y-%m-%d %H:%i:%s") AS payment_date
                    FROM film f, inventory i, rental r, payment p
                    WHERE p.customer_id = ? AND r.customer_id = p.customer_id 
                    AND i.inventory_id = r.inventory_id AND i.film_id = f.film_id
                    AND p.payment_date BETWEEN ? AND ?;`;
                    params = [customer_id,start_date,end_date];
                // If either dates are not defined (just give all records)
                } else {
                    sql = 
                    `SELECT f.title, p.amount, DATE_FORMAT (p.payment_date, "%Y-%m-%d %H:%i:%s") AS payment_date
                    FROM film f, inventory i, rental r, payment p
                    WHERE p.customer_id = ? AND r.customer_id = p.customer_id 
                    AND i.inventory_id = r.inventory_id AND i.film_id = f.film_id`;
                    params = [customer_id];
                }
                conn.query(sql,params,(err,res)=> {
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
    // Endpoint 8
    insertCustomer: (store_id,first_name,last_name,email,address, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const {address_line1,address_line2,district,city_id,postal_code,phone} = address;
                const sql1 = 
                `INSERT into address(address,address2,district,city_id,postal_code,phone)
                VALUES (?,?,?,?,?,?);`;
                conn.query(sql1,[address_line1,address_line2,district,city_id,postal_code,phone], (err1,res1)=> {
                    if (err1) {
                        console.log(err1);
                        return callback(err1,null);
                    } else {
                        const address_id = res1.insertId;
                        const sql2 = `INSERT INTO customer(store_id,first_name,last_name,email,address_id)
                        VALUES (?,?,?,?,?);`;
                        conn.query(sql2,[store_id,first_name,last_name,email,address_id],(err2,res2) => {
                            conn.end();
                            if (err2) {
                                console.log(err2);
                                return callback(err2,null);
                            } else {
                                return callback(null,res2)
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = customer;