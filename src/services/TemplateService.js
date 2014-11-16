/**
 * Created by careerBox on 2014-11-14.
 */

var requirejs = require('../require.config');

var Template = requirejs('classes/Templates/Template');
var ListTemplate = requirejs('classes/Templates/ListTemplate');
var TemplateType = requirejs('classes/Enums/TemplateType');

var async = require('async');
var Result = require('./result');
var ObjectID = require('mongodb').ObjectID;
var genID = require('../util/genID');

var _server = null;

module.exports.set = function (server) {
    _server = server;

    server.post('/template', createService);
    server.delete('/template', deleteService);
    server.get('/template/:templateType', getTemplateListService);
    server.put('/template', updateService);
};

function createService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var newTemplate = req.body.template;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!newTemplate) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    if (newTemplate.templateType === TemplateType.articleList) {
        newTemplate = new ListTemplate(newTemplate);
    } else {
        newTemplate = new Template(newTemplate);
    }
    newTemplate._member_id = session._id;
    newTemplate.version = 0;

    for (var k in newTemplate.target) {
        newTemplate.target[k]._id = genID();
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('template', callback);
            },
            function (collection, callback) { // create
                collection.insert(newTemplate, callback);
            }
        ], function sendResult(err, insertResult) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(insertResult[0]._id);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function deleteService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var _template_id = req.body._id;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!_template_id) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('template', callback);
            },
            function (collection, callback) { // delete
                collection.remove({
                    _id: new ObjectID(_template_id)
                }, callback);
            }
        ], function sendResult(err) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(null);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function getTemplateListService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var templateType = req.params.templateType;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!templateType) {
        result.setCode('001');
        res.end(result.toString());
        return;
    } else if (templateType !== TemplateType.article && templateType !== TemplateType.articleList && templateType !== TemplateType.section) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    try {
        async.waterfall([
            function (cb) { // Open Collection
                _server.dbhelper.connectAndOpen('template', cb);
            },
            function (collection, cb2) { // find
                collection.find({
                    _member_id: session._id,
                    templateType: templateType
                }).toArray(cb2);
            }
        ], function sendResult(err, templateList) {
            if (err) {
                console.log(err.message);
                return;
            }

            async.each(templateList, function (template, callback) {
                delete template._member_id;
                callback();
            });

            var result = new Result(null);
            result.result = templateList;
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}

function updateService(req, res) {
    var session = req.session;
    var result = new Result(null);
    var changedTemplate = req.body.template;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (!session._id) {
        result.setCode('002');
        res.end(result.toString());
        return;
    } else if (!changedTemplate) {
        result.setCode('001');
        res.end(result.toString());
        return;
    }

    if (changedTemplate.itemType === TemplateType.articleList) {
        changedTemplate = new ListTemplate(changedTemplate);
    } else {
        changedTemplate = new Template(changedTemplate);
    }
    changedTemplate._member_id = session._id;
    changedTemplate._id = new ObjectID(changedTemplate._id);

    delete changedTemplate.version;

    try {
        async.waterfall([
            function (callback) { // Open Collection
                _server.dbhelper.connectAndOpen('template', callback);
            },
            function (collection, callback) { // update
                collection.update(
                    {_id: changedTemplate._id},
                    {
                        $set: changedTemplate,
                        $inc: {version: 1}
                    },
                    callback
                );
            }
        ], function sendResult(err) {
            if (err) {
                console.log(err.message);
                return;
            }

            var result = new Result(null);
            res.end(result.toString());

            _server.dbhelper.close();
        });
    } catch (err) {
        console.log(err.message);
    }
}