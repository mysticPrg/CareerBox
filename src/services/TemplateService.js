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

var CaptureFromSite = require('../util/CaptureFromSite');

var _server = null;

module.exports.set = function (server) {
    _server = server;

    server.post('/template', createOrUpdateService);
    server.delete('/template', deleteService);
    server.get('/template', getTemplateListService);
    server.get('/template/:infoType', getTemplateListByInfoTypeService);
    server.get('/template/preview/:_id', getTemplateByIdService);
    server.get('/template/check/:_id', getTemplateUsingCheckService);
    server.get('/template/thumb/:_id', downloadThumbService);
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

function checkArgForInfoTypeOnParams(req, res) {
    var _paper_id = req.params.infoType;
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

        for (var i=0 ; i<newTemplate.target.childArr[k].length ; i++ ) {
            if (!newTemplate.target.childArr[k][i]._id) {
                newTemplate.target.childArr[k][i]._id = genID();
            }
        }
    }

    newTemplate.target = new Article(newTemplate.target);

    if (newTemplate._id) {
        console.log(newTemplate._id);
        newTemplate._id = new ObjectID(newTemplate._id);

        TemplateDB.update(newTemplate, function (err) {
            CaptureFromSite(newTemplate._id.toHexString(), 'template', null, function(err2) {
                ServiceUtil.sendResult(err2, res, null);
            });
        });
    } else {
        TemplateDB.create(newTemplate, function (err, created) {

            var _id = created[0]._id.toHexString();

            CaptureFromSite(_id, 'template', null, function(err2) {
                ServiceUtil.sendResult(err2, res, _id);
            });

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

function getTemplateListByInfoTypeService(req, res) {
    ServiceUtil.setResHeader(res);
    if (!ServiceUtil.checkSession(req, res)) {
        return;
    }
    if (!checkArgForInfoTypeOnParams(req, res)) {
        return;
    }

    var infoType = req.params.infoType;

    TemplateDB.getListByInfoType(req.session._id, infoType, function (err, list) {
        ServiceUtil.sendResult(err, res, list);
    });
}

function getTemplateByIdService(req, res) {
    ServiceUtil.setResHeader(res);
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    var _id = req.params._id;

    TemplateDB.getById(_id, function (err, finded) {

        if (!finded) {
            ServiceUtil.sendResult(err, res, null, '003');
            return;
        }

        ServiceUtil.sendResult(err, res, finded);
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

function downloadThumbService(req, res) {
    if (!checkArgForIdOnParams(req, res)) {
        return;
    }

    TemplateDB.getById(req.params._id, function (err, finded) {
        if (!finded) {
            ServiceUtil.setResHeader(res);
            ServiceUtil.sendResult(err, res, null, '003');
            return;
        }

        var _id = finded._id.toHexString();
        var fileDir = __dirname + '/../../res/screenshot/';
        var filepath = fileDir + _id + '.png';

        res.download(filepath, _id + '.png');
    });
}