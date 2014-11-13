/**
 * Created by careerBox on 2014-11-13.
 */

var requirejs = require('../require.config');

var Portflio = requirejs('classes/Portfolio');

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

function createService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var newPortfolio = req.body.portfolio;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!newPortfolio) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    newPortfolio = new Portflio(newPortfolio);
    newPortfolio._member_id = session._id;

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('portfolio', callback);
            },
            function (collection, callback) { // create
                collection.insert(newPortfolio, callback);
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

function deleteService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var _portfolio_id = req.body._id;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!_portfolio_id) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('portfolio', callback);
            },
            function (collection, callback) { // delete
                collection.remove({
                    _id: new ObjectID(_portfolio_id)
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

function getPortfolioListService(req, res) {
    var session = req.session;
    var result = new Result(null);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('portfolio', callback);
            },
            function (collection, callback) { // find
                collection.find({
                    _member_id: session._id
                }).toArray(callback);
            }
        ], function sendResult(err, portfolioList) {
            if (err) {
                console.log(err.message);
                return;
            }

            async.each(portfolioList, function(portfolio, callback) {
                delete portfolio._member_id;
                callback();
            });

            var result = new Result(null);
            result.result = portfolioList;
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function getPortfolioService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var _portfolio_id = req.params._id;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!ObjectID.isValid(_portfolio_id)) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('portfolio', callback);
            },
            function (collection, callback) { // find
                collection.findOne({
                    _id: new ObjectID(_portfolio_id)
                }, callback);
            }
        ], function sendResult(err, portfolio) {
            if (err) {
                console.log(err.message);
                return;
            }

            if ( portfolio ) {
                delete portfolio._member_id;
            }

            var result = new Result(null);
            result.result = portfolio;
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
    var changedPortfolio = req.body.portfolio;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!changedPortfolio) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    changedPortfolio = new Portflio(changedPortfolio);
    changedPortfolio._member_id = session._id;
    changedPortfolio._id = new ObjectID(changedPortfolio._id);

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('portfolio', callback);
            },
            function (collection, callback) { // update
                collection.update({_id: changedPortfolio._id}, changedPortfolio, callback);
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