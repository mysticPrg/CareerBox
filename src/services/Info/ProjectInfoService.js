/**
 * Created by careerBox on 2014-12-16.
 */


var ProjectInfoDB = require('../../db/Info/ProjectInfoDB');
var Result = require('../result');
var ServiceUtil = require('../../util/ServiceUtil');

module.exports.set = function (server) {
    server.post('/info/project', saveService);
    server.get('/info/project', readService);
};

function checkArgForProjectInfo(req, res) {
    if (!req.body.projectInfo) {

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
    if (!checkArgForProjectInfo(req, res)) {
        return;
    }

    var data = req.body.projectInfo;
    data._member_id = req.session._id;

    ProjectInfoDB.save(data, function (err, saved) {
        ServiceUtil.sendResult(err, res, saved._id);
    });
}

function readService(req, res) {

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    ProjectInfoDB.read(_member_id, function (err, finded) {
        ServiceUtil.sendResult(err, res, finded);
    });
}