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

function getList(_member_id, templateType, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

    templateCollection.find({
        _member_id: _member_id,
        templateType: templateType,
    }).toArray(function (err, list) {
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

    templateCollection.remove({'_id': new ObjectID(_id)}, callback);
}

function update(data, callback) {
    var templateCollection = require('../util/DBCollections').getInstance().collections.template;

//    var template = new Template(data);
    var template = data;

    templateCollection.update(
        {_id: template._id},
        {
            $set: template
        },
        function(err, updated) {
            PaperDB.refreshTempalteData(template, function(err2) {
                callback(err2)
            })
        }
    );
}

var exports = {
    create: create,
    get: get,
    getList: getList,
    remove: remove,
    update: update
}

module.exports = exports;