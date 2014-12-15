/**
 * Created by careerBox on 2014-12-15.
 */

var Result = require('../services/result');

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

var exports = {
    checkErr: checkErr,
    setResHeader: setResHeader,
    checkSession: checkSession,
    sendResult: sendResult
};

module.exports = exports;