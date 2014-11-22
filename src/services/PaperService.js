/**
 * Created by mysticPrg on 2014-09-22.
 * Provider for Paper Service
 */


var requirejs = require('../require.config');

var Paper = requirejs('classes/Paper');
var PaperDB = require('../db/PaperDB');

var async = require('async');
var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;

var _server = null;

module.exports.set = function (server) {
    server.post('/portfolio/paper', createService);
    server.delete('/portfolio/paper', deleteService);
    server.get('/portfolio/paper/:_id', loadService);
    server.put('/portfolio/paper', updateService);

    _server = server;
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

function checkArgForPaper(req, res) {
    if (!req.body.paper) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForId(req, res) {
    var _paper_id = req.body._id;
    if (!req.body._id || !ObjectID.isValid(_paper_id)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForPortfolioId(req, res) {
    if (!req.body._portfolio_id) {

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
    var newPaper = req.body.paper;
    var _portfolio_id = req.body._portfolio_id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForPaper(req, res)) {
        return;
    }
    if (!checkArgForPortfolioId(req, res)) {
        return;
    }

    newPaper._member_id = session._id;
    newPaper._portfolio_id = _portfolio_id;

    PaperDB.create(newPaper, function (err, created) {
        sendResult(err, res, created);
    });
}

function deleteService(req, res) {
    var _paper_id = req.body._id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForId(req, res)) {
        return;
    }

    PaperDB.remove(_paper_id, function (err) {
        sendResult(err, res, null);
    });
}

function loadService(req, res) {
    var _paper_id = req.params._id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForId(req, res)) {
        return;
    }

    PaperDB.get(_paper_id, function(err, paper) {
        sendResult(err, res, paper);
    });
}

function updateService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var changedPaper = req.body.paper;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForPaper(req, res)) {
        return;
    }

//    changedPaper = new Paper(changedPaper);
//    changedPaper._member_id = session._id;
    changedPaper._id = new ObjectID(changedPaper._id);
    PaperDB.update(changedPaper, function(err) {
        sendResult(err, res, null);
    });
}