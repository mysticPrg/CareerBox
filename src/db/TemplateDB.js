/**
 * Created by careerBox on 2014-11-21.
 */

var requirejs = require('../require.config');
var Template = requirejs('classes/Templates/Template');

var PaperDB = require('./PaperDB');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function create(data, callback) {
//    var template = new Template(data);

    var template = data;

    var templateCollection = require('../util/DBCollections').getInstance().collections.template;
    templateCollection.insert(template, callback);
}

function get(data, callback) {
    var template = new Template(data);

    var templateCollection = require('../util/DBCollections').getInstance().collections.template;
    templateCollection.findOne(template, function (err, findTemplate) {
        if (findTemplate) {
            delete findTemplate._member_id;
        }
        callback(err, findTemplate);
    });
}

function getById(_id, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;
    templateCollection.findOne({
        _id: new ObjectID(_id)
    }, function (err, findTemplate) {
        if (findTemplate) {
            delete findTemplate._member_id;
        }
        callback(err, findTemplate);
    });
}

function getList(_member_id, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    templateCollection.find({
        _member_id: _member_id
    }).toArray(function (err, list) {
        async.each(list, function (t, cb) {
            delete t._member_id;
            cb();
        }, function () {
            callback(err, list);
        });
    });
}

function getListByInfoType(_member_id, infoType, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    templateCollection.find({
        _member_id: _member_id,
        'target.bindingType.infoType': infoType
    }).toArray(function (err, list) {
        async.each(list, function (t, cb) {
            delete t._member_id;
            cb();
        }, function () {
            callback(err, list);
        });
    });
}

function getBasicList(callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    templateCollection.find({
        isBasic: true
    })
        .sort({
            order: 1
        })
        .toArray(function (err, list) {
            async.each(list, function (t, cb) {
                delete t._member_id;
                cb();
            }, function () {
                callback(err, list);
            });
        });
}

function getBasicListByInfoType(infoType, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    templateCollection.find({
        isBasic: true,
        'target.bindingType.infoType': infoType
    })
        .sort({
            order: 1
        })
        .toArray(function (err, list) {
            async.each(list, function (t, cb) {
                delete t._member_id;
                cb();
            }, function () {
                callback(err, list);
            });
        });
}

function remove(_id, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    templateCollection.remove({'_id': new ObjectID(_id)}, function () {
        PaperDB.removeTemplateData(_id, callback);
    });
}

function update(data, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    var template = data;

    templateCollection.update(
        {_id: template._id},
        {
            $set: template
        },
        function () {
            PaperDB.refreshTempalteData(template, function (err2) {
                callback(err2);
            });
        }
    );
}

function checkUsingTemplate(_id, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.findOne({
        childArr: {$elemMatch: {_template_id: _id}}
    }, function (err, finded) {
        if (finded) {
            callback(err, true);
        } else {
            callback(err, false);
        }
    });
}

function reset() {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;
    templateCollection.remove({}, function () {
        return;
    });
}

var exports = {
    create: create,
    get: get,
    getById: getById,
    getList: getList,
    getListByInfoType: getListByInfoType,
    getBasicList: getBasicList,
    getBasicListByInfoType: getBasicListByInfoType,
    remove: remove,
    update: update,
    checkUsingTemplate: checkUsingTemplate,
    reset: reset
};

module.exports = exports;