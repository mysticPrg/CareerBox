/**
 * Created by mysticPrg on 2014-09-22.
 */

var http = require('http');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var DBHelper = require('../util/DBHelper');

var app = express();
var server = null;

function allowCrossDomain(req, res, next) {
//    res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
////    res.header('Access-Control-Allow-Origin', req.headers.origin);
//    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
//    res.header('Access-Control-Allow-Credentials', true);
//
//    next();

    var allowedHost = [
        'http://localhost:63342'
    ];

    if (allowedHost.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
//        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    } else {
        //res.send({auth: false});
        next();
    }
}

morgan.token('session', function (req) {
    return req.session.email;
});

app.dbhelper = new DBHelper();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'careerkey',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: 'mongodb://localhost:27017/careerbox'
    })
//    cookie: { secure: true },
//    name: 'careerbox.session',
//    rolling: true
}));
app.use(allowCrossDomain);
app.use('/res', express.static(__dirname + '/../../res'));
app.use('/src', express.static(__dirname + '/../../src'));
app.use(morgan(':remote-addr :session [:date], :method :url :response-time ms [:status]'));

app.start = function (port) {
    server = http.createServer(app).listen(port);
    console.log('CareerBox Service Server Listening on port ' + port + '\n');
    require('../util/DBCollections').getInstance().open();
};

app.close = function () {
    if (server) {
        server.close();
    }

    if (this.dbhelper) {
        this.dbhelper.close();
    }
};

module.exports = app;