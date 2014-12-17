/**
 * Created by careerBox on 2014-12-16.
 */


var ColumnInfoDB = require('../../db/Info/ColumnInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/column', saveService);
    server.get('/info/column', readService);
};

function checkArgForColumnInfo(req, res) {
    if (!req.body.columnInfo) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function saveService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForColumnInfo(req, res)) {
        return;
    }

    var data = req.body.columnInfo;
    data._member_id = req.session._id;

    ColumnInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    ColumnInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}