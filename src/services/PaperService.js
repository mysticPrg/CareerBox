/**
 * Created by mysticPrg on 2014-09-22.
 * Provider for Paper Service
 */


var PaperDB = require('../db/PaperDB');

var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;

var genID = require('../util/genID');

module.exports.set = function (server) {
    server.post('/portfolio/paper', createOrUpdateService);
    server.delete('/portfolio/paper', deleteService);
    server.get('/portfolio/paper/:_id', loadService);
    server.post('/portfolio/paperList', loadListService);
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

function sendResult(err, res, data) {
    if (!checkErr(err)) {
        return;
    }

    var result = new Result(data);
    res.end(result.toString());
}

function createOrUpdateService(req, res) {
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

    for (var k in newPaper.childArr) {
        if (!newPaper.childArr[k]._id) {
            newPaper.childArr[k]._id = genID();
        }
    }

    if (newPaper._id) {
        newPaper._id = new ObjectID(newPaper._id);
        PaperDB.update(newPaper, function(err) {
            sendResult(err, res, null);
        });
    } else {
        PaperDB.create(newPaper, function (err, created) {
            sendResult(err, res, created[0]._id.toHexString());
        });
    }
}

function deleteService(req, res) {
    var _paper_id = req.body._id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnBody(req, res)) {
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
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    PaperDB.get(_paper_id, function(err, paper) {
        sendResult(err, res, paper);
    });
}

function loadListService(req, res) {
    var _portfolio_id = req.body._portfolio_id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForPortfolioId(req, res)) {
        return;
    }

    PaperDB.getList(_portfolio_id, function(err, list) {
        sendResult(err, res, list);
    });
}