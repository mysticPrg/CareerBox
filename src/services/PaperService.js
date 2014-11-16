/**
 * Created by mysticPrg on 2014-09-22.
 * Provider for Paper Service
 */


var requirejs = require('../require.config');

var Paper = requirejs('classes/Paper');

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

function createService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var newPaper = req.body.paper;
    var _portfolio_id = req.body._portfolio_id;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!newPaper) {
        result.setCode('001');
        res.end(result.toString());
        return;
    } else if (!_portfolio_id) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    newPaper = new Paper(newPaper);
    newPaper._member_id = session._id;
    newPaper._portfolio_id = _portfolio_id;

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('paper', callback);
            },
            function (collection, callback) { // create
                collection.insert(newPaper, callback);
            }
        ], function sendResult(err, insertResult) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(insertResult[0]._id);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function deleteService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var _paper_id = req.body._id;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!_paper_id) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('paper', callback);
            },
            function (collection, callback) { // delete
                collection.remove({
                    _id: new ObjectID(_paper_id)
                }, callback);
            }
        ], function sendResult(err) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(null);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function loadService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var _paper_id = req.params._id;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!ObjectID.isValid(_paper_id)) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('paper', callback);
            },
            function (collection, callback) { // find
                collection.findOne({
                    _id: new ObjectID(_paper_id)
                }, callback);
            }
        ], function sendResult(err, paper) {
            if (err) {
                console.log(err.message);
                return;
            }

            if ( paper ) {
                delete paper._portfolio_id;
            }

            var result = new Result(null);
            result.result = paper;
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function updateService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var changedPaper = req.body.paper;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!changedPaper) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    changedPaper = new Paper(changedPaper);
    changedPaper._member_id = session._id;
    changedPaper._id = new ObjectID(changedPaper._id);

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('portfolio', callback);
            },
            function (collection, callback) { // update
                collection.update({_id: changedPaper._id}, changedPaper, callback);
            }
        ], function sendResult(err) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(null);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}