const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const actor = require('../model/actor.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());

// Endpoint 1
app.get('/actors/:actor_id', (req,res)=> {
    const actor_id = req.params.actor_id;
    actor.getActor(actor_id, (err,result)=> {
        if (!err) {
            // case 1 (if it returns exactly 1 actor)
            if (result.length==1) {
                res.status(200);
                res.type('application/json');
                res.send(result[0]);
                // case 2 (if there is no actor with that id)
            } else {
                res.status(204);
                res.type('application/json');
                res.send();
            }
            // server error
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 2
app.get('/actors', (req,res) => {
    let limit, offset;

    // If they never key in limit or if limit is not a number, we use default value of 20
    if (req.query.limit == null || (isNaN(req.query.limit)) || (parseInt(req.query.offset)<0)) {
        limit = 20;
    } else {
        // even if they key in float just return an int
        limit = parseInt(req.query.limit);
    }

    // If they never key in offset or if offset is not a positive number, we use default value of 0
    if (req.query.offset == null || isNaN(req.query.offset) || (parseInt(req.query.offset)<0)) {
        offset = 0;
    } else {
        // even if they key in float just return an int
        offset = parseInt(req.query.offset); 
    }
    
    actor.listActors(limit,offset, (err,result) => {
        // case 1 (successful)
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send(result);
            // case 2 server error  
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 3
app.post('/actors',(req,res)=> {

    const {first_name,last_name} = req.body;

    // Case 2 missing data
    if (first_name==null||last_name==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        res.end();
        return;
    }

    actor.insertActor(first_name,last_name, (err,result) => {
        // case 1 successful
        if (!err) {
            res.status(201);
            res.type('application/json');
            res.send(`{"actor_id": "${result.insertId}"}`);
            // case 2 server error  
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 4
app.put('/actors/:actor_id',(req,res)=> {
    const id = req.params.actor_id;
    const {first_name,last_name} = req.body;

    /*
        If both key missing, return missing data
        If one key missing, update only that key
        If both key present update both key

        If keys are present but missing value ("") still update key
    */

    // Case 2 missing data (both are undefined)
    if (first_name==null && last_name==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    }

    actor.updateActor(first_name,last_name,id, (err,result)=> {
        // case 1 (successful)
        if (!err) {
            if (result.affectedRows==1) {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "record updated"}`);
            } else {
                res.status(204);
                res.type('application/json');
                res.send();
            }
        // case 3 (server error)
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 5
app.delete('/actors/:actor_id', (req,res)=> {
    const id = req.params.actor_id;
    actor.deleteActor(id, (err,result)=> {
        if (!err) {
            if (result.affectedRows==1) {
                res.status(200);
                res.type('application/json');
                res.send(`{"success_msg": "record updated"}`);
            } else {
                res.status(204);
                res.type('application/json');
                res.send();
            }
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 6
app.get('/film_categories/:category_id/films', (req,res) => {
    const id = req.params.category_id;
    actor.getFilmByCategory(id, (err,result)=> {
        if (!err) {
            res.status(200);
            res.type('application/json');
            res.send(result);
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 7
app.get('/customer/:customer_id/payment', (req,res) => {
    const id = req.params.customer_id;
    let start_date,end_date;
    let total=0;

    if (req.query.start_date == null) {
        res.status(200);
        res.type('application/json');
        res.send(`{"rental": [],
                    "total": ${total}}`);
        return;
    } else {
        start_date = req.query.start_date;
    }

    if (req.query.end_date == null) {
        res.status(200);
        res.type('application/json');
        res.send(`{"rental": [],
                    "total": ${total}}`);
        return;
    } else {
        end_date = req.query.end_date;
    }

    actor.getPaymentBtwnDates(id,start_date,end_date, (err,result)=> {
        if (!err) {
            for (i of result) {
                total+=i.amount;
            }
            res.status(200);
            res.type('application/json');
            res.send(`{"rental":${JSON.stringify(result)},
                       "total": ${total==0 ? total : total.toFixed(2)}}`);
        } else {
            res.status(500);
            res.type('application/json');
            res.send(`{"error_msg":"Internal server error"}`);
        }
    });
});

// Endpoint 8
app.post('/customers',(req,res)=> {
    const {store_id, first_name, last_name, email, address} = req.body;
    if (store_id==null || first_name==null || last_name==null || email==null || address==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    } else if (address.address_line1==null || address.address_line2==null || address.district==null || address.city_id==null || address.postal_code==null || address.phone==null) {
        res.status(400);
        res.type('application/json');
        res.send(`{"error_msg": "missing data"}`);
        return;
    } else {
        actor.insertCustomer(store_id,first_name,last_name,email,address, (err,result)=> {
            if (!err) {
                res.status(201);
                res.type('application/json');
                res.send(`{"customer_id":"${result.insertId}"}`);
            } else {
                if (err.code=='ER_DUP_ENTRY') {
                    res.status(409);
                    res.type('application/json');
                    res.send(`{"error_msg":"email already exist"}`);
                } else {
                    res.status(500);
                    res.type('application/json');
                    res.send(`{"error_msg":"Internal server error"}`);
                }
            }
        })
    }
});



module.exports = app;