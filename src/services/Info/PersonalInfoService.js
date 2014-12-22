/**
 * Created by careerBox on 2014-12-15.
 */

var PersonalInfoDB = require('../../db/Info/PersonalInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/personal', saveService);
    server.get('/info/personal', readService);
    server.get('/info/mainInfo', getMainInfoService);
};

function checkArgForPersonalInfo(req, res) {
    if (!req.body.personalInfo) {

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
    if (!checkArgForPersonalInfo(req, res)) {
        return;
    }

    var data = req.body.personalInfo;
    data._member_id = req.session._id;

    PersonalInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    PersonalInfoDB.read(_member_id, function (err, finded) {
        if ( finded ) {
            finded._member_email = req.session.email;
        }
//        } else {
//            finded = {
//                _member_email: req.session.email
//            }
//        }
        ServiceUtil.sendResult(err, res, finded);
    });
}

function getMainInfoService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    PersonalInfoDB.read(_member_id, function (err, finded) {

        var result = {};

        if ( finded ) {
            result._member_name = finded.items[0].S_name_kr;
            result._member_image = finded.items[0].I_picture;
        } else {
            result._member_name = req.session.email;
            result._member_image = null;
        }
        ServiceUtil.sendResult(err, res, result);
    });
}