/**
 * Created by mysticPrg on 2014-09-22.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = null;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.start = function (port) {
	server = http.createServer(app).listen(port);
	console.log('CareerBox Service Server Listening on port ' + port);
};

app.close = function() {
	if ( server !== null )
		server.close();
};

module.exports = app;