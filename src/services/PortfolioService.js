/**
 * Created by careerBox on 2014-11-13.
 */

var requirejs = require('../require.config');

var Portflio = requirejs('classes/Portfolio');

var PortfolioDB = require('../db/PortfolioDB');
var ServiceUtil = require('../util/ServiceUtil');

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

function checkArgForPortfolio(req, res) {
    if (!req.body.portfolio) {

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

function createService(req, res) {
    var session = req.session;
    var newPortfolio = req.body.portfolio;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForPortfolio(req, res)) {
        return;
    }

    newPortfolio = new Portflio(newPortfolio);
    newPortfolio._member_id = session._id;

    PortfolioDB.create(newPortfolio, function(err, created) {
        ServiceUtil.sendResult(err, res, created._id);
    });
}

function deleteService(req, res) {
    var _portfolio_id = req.body._id;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
        return;
    }

    PortfolioDB.remove(_portfolio_id, function(err) {
        ServiceUtil.sendResult(err, res, null);
    });
}

function getPortfolioListService(req, res) {
    var session = req.session;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    PortfolioDB.getList(session._id, function(err, list) {
        ServiceUtil.sendResult(err, res, list);
    });
}

function getPortfolioService(req, res) {
    var _portfolio_id = req.params._id;


    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
        return;
    }

    PortfolioDB.get(_portfolio_id, function(err, portfolio) {
        ServiceUtil.sendResult(err, res, portfolio);
    });
}

function updateService(req, res) {
    var session = req.session;
    var changedPortfolio = req.body.portfolio;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForPortfolio(req, res)) {
        return;
    }

    changedPortfolio = new Portflio(changedPortfolio);
    changedPortfolio._member_id = session._id;
    changedPortfolio._id = new ObjectID(changedPortfolio._id);

    PortfolioDB.update(changedPortfolio, function(err) {
        ServiceUtil.sendResult(err, res, null);
    });
}