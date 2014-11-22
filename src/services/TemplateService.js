/**
 * Created by careerBox on 2014-11-14.
 */

var requirejs = require('../require.config');

var TemplateType = requirejs('classes/Enums/TemplateType');

var TemplateDB = require('../db/TemplateDB');

var async = require('async');
var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;
var genID = require('../util/genID');

var _server = null;

module.exports.set = function (server) {
    _server = server;

    server.post('/template', createOrUpdateService);
    server.delete('/template', deleteService);
    server.get('/template/:templateType', getTemplateListService);
//    server.post('/template', updateService);
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

function checkArgForTemplate(req, res) {
    if (!req.body.template) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForId(req, res) {
    if (!req.body._id) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function checkArgForType(req, res) {

    var type = req.params.templateType;
    if (!type || (type !== TemplateType.article) && (type !== TemplateType.section)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function sendResult(err, res, data) {
    if (!checkErr(err)) {
        return;
    }

    var result = new Result(data);
    res.end(result.toString());
}

function createOrUpdateService(req, res) {
    var newTemplate = req.body.template;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForTemplate(req, res)) {
        return;
    }

    newTemplate._member_id = req.session._id;

    if (newTemplate._id) {
        newTemplate._id = new ObjectID(newTemplate._id);
        TemplateDB.update(newTemplate, function (err) {
            sendResult(err, res, null);
        });
    } else {
        for (var k in newTemplate.childArr) {
            newTemplate.childArr[k]._id = genID();
        }

        TemplateDB.create(newTemplate, function (err, created) {
            sendResult(err, res, created[0]._id);
        });
    }
}

function deleteService(req, res) {
    var _template_id = req.body._id;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForId(req, res)) {
        return;
    }

    TemplateDB.remove(_template_id, function (err) {
        sendResult(err, res, null);
    });
}

function getTemplateListService(req, res) {
    var templateType = req.params.templateType;

    setResHeader(res);
    if (!checkSession(req, res)) {
        return;
    }
    if (!checkArgForType(req, res)) {
        return;
    }

    TemplateDB.getList(req.session._id, templateType, function(err, list) {
        sendResult(err, res, list);
    });
}
