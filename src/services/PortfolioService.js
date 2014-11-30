/**
 * Created by careerBox on 2014-11-13.
 */

var requirejs = require('../require.config');

var Portflio = requirejs('classes/Portfolio');

var PortfolioDB = require('../db/PortfolioDB');

var async = require('async');
var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;

var _server = null;

module.exports.set = function (server) {
    _server = server;

    server.post('/portfolio', createService);
    server.delete('/portfolio', deleteService);
    server.get('/portfolio', getPortfolioListService);
    server.get('/portfolio/:_id', getPortfolioService);
    server.put('/portfolio', updateService);
};


function checkErr(err) {
    if (err) {
        console.log(err.message);
        return false;
    }

    return true;
}

function setResHeader(res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
}

function checkSession(req, res) {
    if (!req.session._id) {

        var result = new Result(null);
        result.setCode('002');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForPortfolio(req, res) {
    if (!req.body.portfolio) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnParams(req, res) {
    var _portfolio_id = req.params._id;
    if (!_portfolio_id || !ObjectID.isValid(_portfolio_id)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnBody(req, res) {
    var _portfolio_id = req.body._id;
    if (!_portfolio_id || !ObjectID.isValid(_portfolio_id)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function sendResult(err, res, data) {
    if (!checkErr(err)) {
        return;
    }

    var result = new Result(data);
    res.end(result.toString());
}

function createService(req, res) {
    var session = req.session;
    var newPortfolio = req.body.portfolio;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForPortfolio(req, res)) {
        return;
    }

    newPortfolio = new Portflio(newPortfolio);
    newPortfolio._member_id = session._id;

    PortfolioDB.create(newPortfolio, function(err, created) {
       sendResult(err, res, created._id);
    });
}

function deleteService(req, res) {
    var _portfolio_id = req.body._id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
        return;
    }

    PortfolioDB.remove(_portfolio_id, function(err) {
       sendResult(err, res, null);
    });
}

function getPortfolioListService(req, res) {
    var session = req.session;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }

    PortfolioDB.getList(session._id, function(err, list) {
        sendResult(err, res, list);
    });
}

function getPortfolioService(req, res) {
    var _portfolio_id = req.params._id;


    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
        return;
    }

    PortfolioDB.get(_portfolio_id, function(err, portfolio) {
       sendResult(err, res, portfolio);
    });
}

function updateService(req, res) {
    var session = req.session;
    var changedPortfolio = req.body.portfolio;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForPortfolio(req, res)) {
        return;
    }

    changedPortfolio = new Portflio(changedPortfolio);
    changedPortfolio._member_id = session._id;
    changedPortfolio._id = new ObjectID(changedPortfolio._id);

    PortfolioDB.update(changedPortfolio, function(err) {
       sendResult(err, res, null);
    });
}