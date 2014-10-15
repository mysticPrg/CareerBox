/**
 * Created by mysticPrg on 2014-09-22.
 */

var http = require('http');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var DBHelper = require('./DBHelper');

var app = express();
var server = null;

app.dbhelper = new DBHelper();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
	secret: 'career key'
}));

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.start = function (port) {
	server = http.createServer(app).listen(port);
	console.log('CareerBox Service Server Listening on port ' + port + '\n');
};

app.close = function () {
	if (server !== null)
		server.close();
};

module.exports = app;