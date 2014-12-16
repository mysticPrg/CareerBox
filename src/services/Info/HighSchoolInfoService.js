/**
 * Created by careerBox on 2014-12-16.
 */


var HighSchoolInfoDB = require('../../db/Info/HighSchoolInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/highSchool', saveService);
    server.get('/info/highSchool', readListService);
};

function checkArgForHighSchoolInfos(req, res) {
    if (!req.body.highSchoolInfos) {

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
    if (!checkArgForHighSchoolInfos(req, res)) {
        return;
    }

    var arrData = req.body.highSchoolInfos;
    for ( var i=0 ; i<arrData.length ; i++ ) {
        arrData[i]._member_id = req.session._id;
    }

    HighSchoolInfoDB.saveList(arrData, function (err) {
        ServiceUtil.sendResult(err, res, null);
    });

}

function readListService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    HighSchoolInfoDB.readList(_member_id, function (err, findedList) {
        ServiceUtil.sendResult(err, res, findedList);
    });
}