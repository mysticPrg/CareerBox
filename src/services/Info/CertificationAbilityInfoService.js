/**
 * Created by careerBox on 2014-12-16.
 */


var CertificationAbilityInfoDB = require('../../db/Info/CertificationAbilityInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/certificationAbility', saveService);
    server.get('/info/certificationAbility', readListService);
};

function checkArgForCertificationAbilityInfo(req, res) {
    if (!req.body.certificationAbilityInfo) {

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
    if (!checkArgForCertificationAbilityInfo(req, res)) {
        return;
    }

    var data = req.body.certificationAbilityInfo;
    data._member_id = req.session._id;

    CertificationAbilityInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });

}

function readListService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    CertificationAbilityInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}