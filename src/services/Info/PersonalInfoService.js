/**
 * Created by careerBox on 2014-12-15.
 */

var PersonalInfoDB = require('../../db/Info/PersonalInfoDB');
var Result = require('../result');

module.exports.set = function (server) {
    server.post('/info/personal', saveService);
    server.get('/info/personal', readService);
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

function checkArgForPersonalInfo(req, res) {
    if (!req.body.personalInfo) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function sendResult(err, res, data, returnCode) {
    if (!checkErr(err)) {
        return;
    }

    var result = new Result(data);
    if (returnCode) {
        result.setCode(returnCode);
    }
    res.end(result.toString());
}

function saveService(req, res) {

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForPersonalInfo(req, res)) {
        return;
    }

    var data = req.body.personalInfo;
    data._member_id = req.session._id;

    PersonalInfoDB.save(data, function (err, savedData) {
        sendResult(err, res, null);
    });

}

function readService(req, res) {

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }

    var _member_id = req.session._id;

    PersonalInfoDB.read(_member_id, function (err, finded) {
        sendResult(err, res, finded);
    });
}