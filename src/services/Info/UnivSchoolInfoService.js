/**
 * Created by careerBox on 2014-12-16.
 */


var UnivSchoolInfoDB = require('../../db/Info/UnivSchoolInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/univSchool', saveService);
    server.get('/info/univSchool', readListService);
};

function checkArgForUnivSchoolInfos(req, res) {
    if (!req.body.univSchoolInfos) {

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
    if (!checkArgForUnivSchoolInfos(req, res)) {
        return;
    }

    var arrData = req.body.univSchoolInfos;
    for ( var i=0 ; i<arrData.length ; i++ ) {
        arrData[i]._member_id = req.session._id;
    }

    UnivSchoolInfoDB.saveList(arrData, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });

}

function readListService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    UnivSchoolInfoDB.readList(_member_id, function (err, findedList) {
        ServiceUtil.sendResult(err, res, findedList);
    });
}