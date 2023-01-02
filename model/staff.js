/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/
// Contains additional endpoint 1
const db = require('./dbConfig.js');

const staff = {
    // Additional Endpoint 1
    insertStaff: (first_name,last_name,email,store_id,username,password,address, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                const {address_line1,address_line2,district,city_id,postal_code,phone} = address;
                // Check if username is already taken
                const sql1 = `SELECT * FROM staff WHERE username = ?;`;
                conn.query(sql1,[username],(err1,res1) => {
                    if (err1) {
                        console.log(err1);
                        return callback(err1,null);
                    } else {
                        // Return the error "Usename already taken"
                        if (res1.length > 0) {
                            return callback("ER_DUP_ENTRY",null);
                        } else {
                            const sql2 = 
                            `INSERT into address(address,address2,district,city_id,postal_code,phone)
                            VALUES (?,?,?,?,?,?);`;
                            conn.query(sql2,[address_line1,address_line2,district,city_id,postal_code,phone], (err2,res2)=> {
                                if (err2) {
                                    console.log(err2);
                                    return callback(err2,null);
                                } else {
                                    const address_id = res2.insertId;
                                    const sql3 = `INSERT INTO staff(first_name,last_name,address_id,email,store_id,username,password)
                                    VALUES (?,?,?,?,?,?,?);`;
                                    conn.query(sql3,[first_name,last_name,address_id,email,store_id,username,password],(err3,res3) => {
                                        conn.end();
                                        if (err3) {
                                            console.log(err3);
                                            return callback(err3,null);
                                        } else {
                                            return callback(null,res3)
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}

module.exports = staff;