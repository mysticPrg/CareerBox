/**
 * Created by careerBox on 2014-12-15.
 */

var AdditionalInfoDB = require('../../db/Info/AdditionalInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/additional', saveService);
    server.get('/info/additional', readService);
};

function checkArgForAdditionalInfo(req, res) {
    if (!req.body.additionalInfo) {

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
    if (!checkArgForAdditionalInfo(req, res)) {
        return;
    }

    var data = req.body.additionalInfo;
    data._member_id = req.session._id;

    AdditionalInfoDB.save(data, function (err) {
        ServiceUtil.sendResult(err, res, null);
    });

}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    AdditionalInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}