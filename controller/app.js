const e = require('express');
const express = require('express')
const app = express();
const actor = require('../model/actor.js');

// Endpoint 1
app.get('/actors/:actorid', (req,res)=> {
    const id = req.params.actorid;
    actor.getActor(id, (err,result)=> {
        if (!err) {
            // case 1 (if it returns exactly 1 actor)
            if (result.length==1) {
                res.status(200);
                res.type('application/json');
                res.send(result);
                // case 2 (if there is no actor with that id)
            } else {
                res.status(204);
                res.type('application/json');
                res.send('No Content. Record of given actor_id cannot be found.');
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
    /*
    Check if limit and offset are:
        - not null and not undefined
        - not floats
        - not negative
        - not strings (that are non numerical)
    */

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
    /*
        Check if first_name and last_name are:
            - strings (regex)
            - not null and not undefined
    */

});

module.exports = app;