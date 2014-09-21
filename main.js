/**
 * Created by mysticPrg on 2014-09-22.
 */

var http = require('http');
var express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.write('test');
	res.end();
});

http.createServer(app).listen(8123);

console.log('CareerBox Service Server Listening on port 8123');