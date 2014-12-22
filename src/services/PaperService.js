/**
 * Created by mysticPrg on 2014-09-22.
 * Provider for Paper Service
 */


var PaperDB = require('../db/PaperDB');
var ServiceUtil = require('../util/ServiceUtil');

var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;

var CaptureFromSite = require('../util/CaptureFromSite');
var BindingService = require('./BindingService');

var genID = require('../util/genID');

module.exports.set = function (server) {
    server.post('/portfolio/paper', createOrUpdateService);
    server.delete('/portfolio/paper', deleteService);
    server.get('/portfolio/paper/:_id', loadService);
    server.get('/portfolio/paper/:_id/:_member_id', loadOtherMembersService);
    server.post('/portfolio/paperList', loadListService);
    server.post('/portfolio/paper/setIndex', setIndexService);
};

function checkArgForPaper(req, res) {
    if (!req.body.paper) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnParams(req, res) {
    var _paper_id = req.params._id;
    if (!_paper_id || !ObjectID.isValid(_paper_id)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForMemberIdOnParams(req, res) {
    var _paper_id = req.params._member_id;
    if (!_paper_id || !ObjectID.isValid(_paper_id)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForIdOnBody(req, res) {
    var _paper_id = req.body._id;
    if (!_paper_id || !ObjectID.isValid(_paper_id)) {

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

function createOrUpdateService(req, res) {
    var session = req.session;
    var newPaper = req.body.paper;
    var _portfolio_id = req.body._portfolio_id;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
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

    for (var k in newPaper.childArr) {
        if (!newPaper.childArr[k]._id) {
            newPaper.childArr[k]._id = genID();
        }
    }

    if (newPaper._id) {
        newPaper._id = new ObjectID(newPaper._id);
        PaperDB.update(newPaper, function (err) {
            if (newPaper.isIndex) {
                CaptureFromSite(newPaper._portfolio_id, 'portfolio', req.session._id, function (err2) {
                    ServiceUtil.sendResult(err2, res, null);
                    return;
                });
            } else {
                ServiceUtil.sendResult(err, res, null);
                return;
            }
        });
    } else {
        PaperDB.create(newPaper, function (err, created) {
            ServiceUtil.sendResult(err, res, created[0]._id.toHexString());
        });
    }
}

function deleteService(req, res) {
    var _paper_id = req.body._id;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
        return;
    }

    PaperDB.remove(_paper_id, function (err) {
        ServiceUtil.sendResult(err, res, null);
    });
}

function loadService(req, res) {
    var _paper_id = req.params._id;

    ServiceUtil.setResHeader(res);
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    PaperDB.get(_paper_id, function (err, paper) {
        BindingService(paper, req.session._id, function () {
            ServiceUtil.sendResult(err, res, paper);
        });
    });
}

function loadOtherMembersService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }
    if (!checkArgForMemberIdOnParams(req, res)) {
        return;
    }

    var _paper_id = req.params._id;
    var _member_id = req.params._member_id;

    PaperDB.get(_paper_id, function (err, paper) {
        BindingService(paper, _member_id, function () {
            ServiceUtil.sendResult(err, res, paper);
        });
    });
}

function loadListService(req, res) {
    var _portfolio_id = req.body._portfolio_id;

    ServiceUtil.setResHeader(res);
//    if (!ServiceUtil.checkSession(req, res)) {
//        return;
//    }
    if (!checkArgForPortfolioId(req, res)) {
        return;
    }

    PaperDB.getList(_portfolio_id, function (err, list) {
        ServiceUtil.sendResult(err, res, list);
    });
}

function setIndexService(req, res) {

    var _portfolio_id = req.body._portfolio_id;
    var _paper_id = req.body._paper_id;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForPortfolioId(req, res)) {
        return;
    }

    PaperDB.setIndex(_portfolio_id, _paper_id, function (err) {
        CaptureFromSite(_portfolio_id, 'portfolio', req.session._id, function (err2) {
            ServiceUtil.sendResult(err2, res, null);
            return;
        });
    });
}