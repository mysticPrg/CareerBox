/**
 * Created by careerBox on 2014-11-14.
 */

var requirejs = require('../require.config');

var Template = requirejs('classes/Templates/Template');
var Article = requirejs('classes/LayoutComponents/Article');

var TemplateDB = require('../db/TemplateDB');
var ServiceUtil = require('../util/ServiceUtil');

var async = require('async');
var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;
var genID = require('../util/genID');

var _server = null;

module.exports.set = function (server) {
    _server = server;

    server.post('/template', createOrUpdateService);
    server.delete('/template', deleteService);
    server.get('/template', getTemplateListService);
    server.get('/template/check/:_id', getTemplateUsingCheckService);
};

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

function checkArgForIdOnParams(req, res) {
    var _paper_id = req.params._id;
    if (!_paper_id || !ObjectID.isValid(_paper_id)) {

        var result = new Result(null);
        result.setCode('001');
        res.end(result.toString());

        return false;
    }

    return true;
}

function createOrUpdateService(req, res) {
    var newTemplate = req.body.template;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForTemplate(req, res)) {
        return;
    }

    newTemplate = new Template(newTemplate);
    newTemplate._member_id = req.session._id;

    for (var k in newTemplate.target.childArr) {
        if (!newTemplate.target.childArr[k]._id) {
            newTemplate.target.childArr[k]._id = genID();
        }
    }

    newTemplate.target = new Article(newTemplate.target);

    if (newTemplate._id) {
        console.log(newTemplate._id);
        newTemplate._id = new ObjectID(newTemplate._id);

        TemplateDB.update(newTemplate, function (err) {
            ServiceUtil.sendResult(err, res, null);
        });
    } else {
        TemplateDB.create(newTemplate, function (err, created) {
            ServiceUtil.sendResult(err, res, created[0]._id.toHexString());
        });
    }
}

function deleteService(req, res) {
    var _template_id = req.body._id;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForId(req, res)) {
        return;
    }

    TemplateDB.remove(_template_id, function (err) {
        ServiceUtil.sendResult(err, res, null);
    });
}

function getTemplateListService(req, res) {
    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }

    TemplateDB.getList(req.session._id, function (err, list) {
        ServiceUtil.sendResult(err, res, list);
    });
}

function getTemplateUsingCheckService(req, res) {
    var _template_id = req.params._id;

    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    TemplateDB.checkUsingTemplate(_template_id, function(err, check) {
        ServiceUtil.sendResult(err, res, check);
    });
}
