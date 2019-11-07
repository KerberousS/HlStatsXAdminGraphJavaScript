//Imports
const dbActions = require('../database/database.js');

//Requires
// const hlstatsxtimes = require('./getdata/getadmindata.js')
const express = require('express');
const app = express();
const Datastore = require('nedb');

const dbUsers = new Datastore({ filename: './resources/db/users.db', autoload: true });
const dbServers = new Datastore({ filename: './resources/db/servers.db', autoload: true });

dbActions.prepareUserDB(dbUsers, dbServers);
dbActions.refreshFullAdminDateTimes(dbServers);

app.listen(3000, () => console.log('listening at 3000'))
app.use(express.static('./public'));
app.use(express.json({ limit: '1mb' }));

//Login endpoint
app.post('/login', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    dbUsers.find({ username: username, password: password }, function (err, docs) {

        console.log(docs);
        const timestamp = getCurrentTime();

        if (err != null) {
            console.log(err);
        } else if (docs.length > 0) {
            console.log("[" + timestamp + "]" + " User logged in with credentials:" + username);
            response.json({
                status: 'success',
                message: 'User found'
            });
        } else {
            console.log("[" + timestamp + "]" + "[ERROR]" + " User tried to log in with credentials:" + username + ", " + password + ", but was unable to.");
            response.json({
                status: 'failure',
                message: 'User was not found, please check your credentials'
            });
        }
    })
});

///Chart endpoints

/* 
- Start of DB manage endpoints -
*/

/* 
- Start of DB Users manage endpoints -
*/

//Users endpoints
app.post('/user/new', (request, response) => {
    //TODO
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});

app.post('/user/edit', (request, response) => {
    //TODO
    console.log(request.body);

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});

app.post('/user/delete', (request, response) => {
    //TODO
    console.log(request.body);

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});
/* 
- END of DB Users manage endpoints -
*/

/* 
- Start of DB Server manage endpoints -
*/
app.post('/server/new', (request, response) => {
    //TODO
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});

app.post('/server/edit', (request, response) => {
    //TODO
    console.log(request.body);

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});

app.post('/server/delete', (request, response) => {
    //TODO
    console.log(request.body);

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});
/* 
- END of DB Server manage endpoints -
*/

/* 
- Start of DB Admin manage endpoints -
*/
app.post('/admin/new', (request, response) => {
    //TODO
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});

app.post('/admin/edit', (request, response) => {
    //TODO
    console.log(request.body);

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});

app.post('/admin/delete', (request, response) => {
    //TODO
    console.log(request.body);

    database.insert(data);

    response.json({
        status: 'success',
        timestamp: timestamp,
    })
});
/* 
- END of DB Admin manage endpoints -
*/


/* 
- END of DB manage endpoints -
*/

/* 
- START of data acquire endpoints -
*/

app.post('/servers', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    const servername = request.body.servername;

    dbUsers.find({ username: username, password: password }, function (err, docs) {

        const timestamp = getCurrentTime();

        if (err != null) {
            console.log(err);
        } else if (docs.length > 0) {
            console.log(docs[0]);
            var servers = docs[0].servers;
            console.log(servers);

            if (servername==null || servername==undefined) {
                dbServers.find({}, function (err, docs) {
                    console.log(docs);
            
                    if (err != null) {
                        console.log(err);
                    } else if (docs.length > 0) {
                        console.log(docs[0]);
                        response.json({
                            status: 'success',
                            serverList: docs
                        });
                    }
                });
            } else if (dbServers.length>=1) {
            dbServers.find({ 'servername': choosenServer }, function (err, docs) {
                console.log(docs);
        
                if (err != null) {
                    console.log(err);
                } else if (docs.length > 0) {
                    console.log(docs[0]);
                    response.json({
                        status: 'success',
                        serverList: docs
                    });
                }
            });
        } else {
            console.log("[" + timestamp + "]" + "[ERROR]" + " User tried to fetch /chart.html in with credentials:" + username + ", " + password + ", but was unable to.");
            response.json({
                status: 'failure',
                message: 'There was a problem'
            });
        }
    }
});
});

/* 
- END of data acquire endpoints -
*/

/* 
- START of Global utility functions -
*/

function getCurrentTime() {
    var now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}

/*
- END of Global utility functions -
*/