/**
 * Created by careerBox on 2014-11-22.
 */


var requirejs = require('../require.config');
var Paper = requirejs('classes/Paper');
var PaperInfo = requirejs('classes/Structs/PaperInfo');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function create(data, callback) {
    var paper = new Paper(data);

    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;
    paperCollection.insert(paper, callback);
}

function get(_id, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.findOne({'_id': new ObjectID(_id)}, callback);
}

function getList(_portfolio_id, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    var resultList = [];
    paperCollection.find({'_portfolio_id': _portfolio_id}).toArray(function(err, list) {
        for ( var i=0 ; i<list.length ; i++ ) {
            resultList.push(new PaperInfo({
                _portfolio_id: list[i]._portfolio_id,
                title: list[i].title
            }));
        }

        callback(err, list);
    });
}

function remove(_id, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.remove({'_id': new ObjectID(_id)}, callback);
}

function update(data, callback) {
    var paper = new Paper(data);
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.update(
        {_id: paper._id},
        {
            $set: paper
        },
        callback
    );
}

function refreshTemplateData(template, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.update(
        {
            _member_id: template._member_id,
            childArr: {$elemMatch: {_template_id: template._id}}
        },
        {
            $set: {
                'childArr.$': template
            }
        },
        {
            multi: true
        },
        callback);
}

var exports = {
    create: create,
    get: get,
    getList: getList,
    remove: remove,
    update: update,
    refreshTempalteData: refreshTemplateData
}

module.exports = exports;