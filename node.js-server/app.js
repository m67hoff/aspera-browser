"use strict";

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const request = require("request");

const express = require("express");
const app = express();

// Globals
function json2s(obj) { return JSON.stringify(obj, null, 2); } // format JSON payload for log
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
    console.log('server starting on ' + appEnv.url);
});

// serve static files out of ./public
const options = {
    setHeaders: (res, path, stat) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
};
app.use(express.static(__dirname + '/public', options));
// console.log(__dirname + '/public');

app.get('/info', (req, res) => {
    console.log('info headers:', json2s(req.headers));

    request.get('https://demo.asperasoft.com:9092/info',
        { 'auth': { 'user': 'asperaweb', 'pass': 'demoaspera' } },
        (error, response, body) => {
            console.log('request.get error:', error);
            console.log('request.get statusCode:', response && response.statusCode);
            // console.log('request.get body:', json2s(JSON.parse(body)));
            // this.res.send(JSON.parse(body));
        }
    );

    // res.setHeader('Content-Type', 'application/json');
    res.status(200)
        .json({ status: 'OK' });
});

app.post('/files/:call', (req, res) => {
    var call = req.params.call;
    console.log('files:', call);

    res.status(200)
        .json({ filesAPI: call });
});