/*
Name: Ryan Yeo
Class: DAAA/FT/1B/01
Admin Number: P2214452
*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const actors = require('../model/actors.js');
const film_categories = require('../model/film_categories.js');
const customer = require('../model/customer.js');
const staff = require('../model/staff.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());

// Endpoint 1
app.get('/actors/:actor_id', (req,res)=> {
    const actor_id = req.params.actor_id;
    actors.getActor(actor_id, (err,result)=> {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        } else {
            // Successful Case (200)
            if (result.length==1) {
                res.status(200);
                res.type('application/json');
                res.send(result[0]);
            // Record of given actor_id cannot be found (204)
            } else {
                res.status(204);
                res.type('application/json');
                res.send();
            }
        }
    });
});

// Endpoint 2
app.get('/actors', (req,res) => {
    let limit, offset;

    // If not provided default to 20 (includes if a non numerical value is keyed in or if a negative number is keyed in)
    if (req.query.limit == null || (isNaN(req.query.limit)) || (parseInt(req.query.offset)<0)) {
        limit = 20;
    } else {
        // Else use the provided value
        limit = parseInt(req.query.limit);
    }
    // If not provided default to 0 (includes if a non numerical value is keyed in or if a negative number is keyed in)
    if (req.query.offset == null || isNaN(req.query.offset) || (parseInt(req.query.offset)<0)) {
        offset = 0;
    } else {
        // Else use the provided value
        offset = parseInt(req.query.offset); 
    }
    
    actors.listActors(limit,offset, (err,result) => {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        // Successful Case (200)
        } else {
            res.status(200);
            res.type('application/json');
            res.send(result);
        }
    });
});

// Endpoint 3
app.post('/actors',(req,res)=> {
    const {first_name,last_name} = req.body;

    /*
        If either key is missing return missing data
        If keys are present but missing value ("") still update key
        It is possible for both keys to have the same value
    */

    // If either key is missing (400)
    if (first_name==null || last_name==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        res.end();
        return;
    }

    actors.insertActor(first_name,last_name, (err,result) => {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        // Successful Case (201)
        } else {
            res.status(201);
            res.type('application/json');
            res.send(`{"actor_id": "${result.insertId}"}`);
        }
    });
});

// Endpoint 4
app.put('/actors/:actor_id',(req,res)=> {
    const id = req.params.actor_id;
    const {first_name,last_name} = req.body;

    /*
        If both key missing, return missing data
        If one key missing, update only the other key that is provided
        If both key present update both key

        If keys are present but missing value ("") still update key
    */

    // Both keys are missing (400)
    if (first_name==null && last_name==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }

    actors.updateActor(first_name,last_name,id, (err,result)=> {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        } else {
            // Successful Case (200)
            if (result.affectedRows==1) {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "record updated"}`);
            // Record of given actor_id cannot be found (204)
            } else {
                res.status(204);
                res.type('application/json');
                res.send();
            }
        }
    });
});

// Endpoint 5
app.delete('/actors/:actor_id', (req,res)=> {
    const id = req.params.actor_id;
    actors.deleteActor(id, (err,result)=> {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        } else {
            // Successful Case (200)
            if (result.affectedRows==1) {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "actor deleted"}`);
            // Record of given actor_id cannot be found (204)
            } else {
                res.status(204);
                res.type('application/json');
                res.send();
            }
        }
    });
});

// Endpoint 6
app.get('/film_categories/:category_id/films', (req,res) => {
    const id = req.params.category_id;
    film_categories.getFilmByCategory(id, (err,result)=> {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        // Successful Case (200)
        } else {
            res.status(200);
            res.type('application/json');
            res.send(result);
        }
    });
});

// Endpoint 7
app.get('/customer/:customer_id/payment', (req,res) => {
    // If either start date or end date is not specified, give all records
    const id = req.params.customer_id;
    const {start_date,end_date} = req.query;
    let total=0;

    customer.getPaymentBtwnDates(id,start_date,end_date, (err,result)=> {
        // Server Error (500)
        if (err) {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        // Successful Case (200)
        } else {
            // Get total by iterating through the array of objects
            for (amt of result) {
                total+=amt.amount;
            }
            res.status(200);
            res.type('application/json');
            res.send(`{"rental":${JSON.stringify(result)},
                       "total": ${total==0 ? total : total.toFixed(2)}}`);
        }
    });
});

// Endpoint 8
app.post('/customers',(req,res)=> {
    const {store_id, first_name, last_name, email, address} = req.body;
    // If either key is missing (400)
    if (store_id==null || first_name==null || last_name==null || email==null || address==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    // If either sub-key (key for address) is missing (400)
    } else if (address.address_line1==null || address.address_line2==null || address.district==null || address.city_id==null || address.postal_code==null || address.phone==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    } else {
        customer.insertCustomer(store_id,first_name,last_name,email,address, (err,result)=> {
            if (err) {
                // User tries to create a record with duplicate email address (409)
                if (err.code=='ER_DUP_ENTRY') {
                    res.status(409);
                    res.type('application/json');
                    res.send(`{"error_msg":"email already exist"}`);
                // Server Error (500)
                } else {
                    res.status(500);
                    res.type('application/json');
                    res.send(`{"error_msg":"Internal server error"}`);
                }
            // Successful Case (201)
            } else {
                res.status(201);
                res.type('application/json');
                res.send(`{"customer_id":"${result.insertId}"}`);
            }
        });
    }
});

// Additional Endpoint 1
app.post("/staff", (req, res) => {
    const {first_name, last_name, email, store_id, username, password, address} = req.body;
    // If either key is missing (400)
    if (first_name==null || last_name==null || email==null || store_id==null || username==null || password==null || address==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    // If either sub-key (key for address) is missing (400)
    } else if (address.address_line1==null || address.address_line2==null || address.district==null || address.city_id==null || address.postal_code==null || address.phone==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    } else {
        staff.insertStaff(first_name,last_name,email,store_id,username,password,address, (err,result)=> {
            if (err) {
                // User tries to create a record with duplicate username (409)
                if (err=='ER_DUP_ENTRY') {
                    res.status(409);
                    res.type('application/json');
                    res.send(`{"error_msg":"username already exist"}`);
                // Server Error (500)
                } else {
                    res.status(500);
                    res.type('application/json');
                    res.send(`{"error_msg":"Internal server error"}`);
                }
            } else {
                res.status(201);
                res.type('application/json');
                res.send(`{"staff_id":"${result.insertId}"}`);
            }
        });
    }
});

// Additional Endpoint 2
app.put("/film/:film_id/category", (req, res) => {
    const id = req.params.film_id;
    const {category} = req.body;

    // If key is missing (400)
    if (category==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    } else {
        film_categories.updateCategory(id,category, (err,result)=> {
            // Server Error (500)
            if (err) {
                // Record of given category does not exist (204)
                if (err=='Category does not exist') {
                    res.status(204);
                    res.type('application/json');
                    res.send();
                } else {
                    res.status(500);
                    res.type('application/json');
                    res.send(`{"error_msg":"Internal server error"}`);
                }
            } else {
                // Successful Case (200)
                if (result.affectedRows==1) {
                    res.status(200);
                    res.type('application/json');
                    res.send(`{"success_msg": "record updated"}`);
                // Record of given actor_id cannot be found (204)
                } else {
                    res.status(204);
                    res.type('application/json');
                    res.send();
                }
            }
        });
    }

});



module.exports = app;