/**
 * Created by careerBox on 2014-12-16.
 */


var PaperAbilityInfoDB = require('../../db/Info/PaperAbilityInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/paperAbility', saveService);
    server.get('/info/paperAbility', readService);
};

function checkArgForPaperAbilityInfo(req, res) {
    if (!req.body.paperAbilityInfo) {

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
    if (!checkArgForPaperAbilityInfo(req, res)) {
        return;
    }

    var data = req.body.paperAbilityInfo;
    data._member_id = req.session._id;

    PaperAbilityInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });

}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    PaperAbilityInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}