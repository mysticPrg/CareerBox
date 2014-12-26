/**
 * Created by careerBox on 2014-11-22.
 */


var requirejs = require('../require.config');
var Paper = requirejs('classes/Paper');
var PaperInfo = requirejs('classes/Structs/PaperInfo');
var Template = requirejs('classes/Templates/Template');
var Article = requirejs('classes/LayoutComponents/Article');

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
    paperCollection.find({'_portfolio_id': _portfolio_id}).toArray(function (err, list) {
        for (var i = 0; i < list.length; i++) {
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

function removeByPortfolio(_portfolio_id, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.remove({'_portfolio_id': _portfolio_id}, callback);
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

    paperCollection.find({
        _member_id: template._member_id,
        childArr: {$elemMatch: {_template_id: template._id.toHexString()}}
    }).toArray(function (err, arr) {
        async.each(arr, function (p, cb) {

            var newArr = [];
            for (var i = 0; i < p.childArr.length; i++) {
                if (p.childArr[i]._template_id !== template._id.toHexString()) {
                    newArr.push(p.childArr[i]);
                } else {
                    var cloneArticle = new Article(template.target);
                    var paperArticle = p.childArr[i];

                    cloneArticle.pos = paperArticle.pos;
                    cloneArticle.zOrder = paperArticle.zOrder;
                    cloneArticle._id = paperArticle._id;
                    cloneArticle._template_id = paperArticle._template_id;
                    cloneArticle.rowCount = paperArticle.rowCount;
                    cloneArticle.colCount = paperArticle.colCount;

                    if (paperArticle.bindingChanged === false) {
                        cloneArticle.isBinding = paperArticle.isBinding;
                        cloneArticle.bindingData = paperArticle.bindingData;
                        cloneArticle.bindingType = paperArticle.bindingType;
                    }
                    cloneArticle.bindingChanged = false;

                    newArr.push(cloneArticle);
                }
            }

            paperCollection.update(
                {
                    _id: p._id
                },
                {
                    $set: {childArr: newArr}
                }
                , cb);
        }, callback);
    });
}

function removeTemplateData(_template_id, callback) {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.find({
        childArr: {$elemMatch: {_template_id: _template_id}}
    }).toArray(function (err, arr) {
        async.each(arr, function (p, cb) {

            var newArr = [];
            for (var i = 0; i < p.childArr.length; i++) {
                if (p.childArr[i]._template_id !== _template_id) {
                    newArr.push(p.childArr[i]);
                }
            }

            paperCollection.update(
                {
                    _id: p._id
                },
                {
                    $set: {childArr: newArr}
                }
                , cb);
        }, callback);
    });

}

function setIndex(_portfolio_id, _paper_id, callback) {

    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;

    paperCollection.find({
        _portfolio_id: _portfolio_id
    }).toArray(function (err, arr) {
        async.forEach(arr, function (p, cb) {
            var cur_paper_id = p._id.toHexString();
            if (cur_paper_id === _paper_id) {
                paperCollection.update(
                    {
                        _id: new ObjectID(_paper_id)
                    },
                    {
                        $set: {isIndex: true}
                    }
                    , cb);
            } else {
                paperCollection.update(
                    {
                        _id: p._id
                    },
                    {
                        $set: {isIndex: false}
                    }
                    , cb);
            }
        }, callback);
    });
}

function reset() {
    var paperCollection = require('../util/DBCollections').getInstance().collections.paper;
    paperCollection.remove({}, function() {
        return;
    });
}

var exports = {
    create: create,
    get: get,
    getList: getList,
    remove: remove,
    removeByPortfolio: removeByPortfolio,
    update: update,
    refreshTempalteData: refreshTemplateData,
    removeTemplateData: removeTemplateData,
    setIndex: setIndex,
    reset: reset
}

module.exports = exports;