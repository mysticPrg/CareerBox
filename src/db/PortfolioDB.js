/**
 * Created by careerBox on 2014-12-01.
 */

var requirejs = require('../require.config');
var Portfolio = requirejs('classes/Portfolio');
var Paper = requirejs('classes/Paper');

var PaperDB = require('./PaperDB');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function create(data, callback) {
    var portfolio = data;

    var portfolioCollection = require('../util/DBCollections').getInstance().collections.portfolio;
    portfolioCollection.insert(portfolio, function (err, createdPortfolio) {
        var paper = new Paper({title: 'Paper 1'});
        paper.isIndex = true;
        paper._portfolio_id = createdPortfolio[0]._id.toHexString();
        PaperDB.create(paper, function () {
            callback(err, createdPortfolio[0]);
        });
    });
}

function get(data, callback) {
    var portfolio = new Portfolio(data);

    var portfolioCollection = require('../util/DBCollections').getInstance().collections.portfolio;
    portfolioCollection.findOne(portfolio, function (err, findPortfolio) {
        if (findPortfolio) {
            delete findPortfolio._member_id;
        }
        callback(err, findPortfolio);
    });
}

function getList(_member_id, callback) {
    var portfolioCollection = require('../util/DBCollections').getInstance().collections.portfolio;

    portfolioCollection.find({
        _member_id: _member_id
    }).toArray(function (err, list) {
        async.each(list, function (p, cb) {
            delete p._member_id;
            cb();
        }, function () {
            callback(err, list);
        });
    });
}

function remove(_id, callback) {
    var portfolioCollection = require('../util/DBCollections').getInstance().collections.portfolio;

    portfolioCollection.remove({'_id': new ObjectID(_id)}, function() {
        PaperDB.removeByPortfolio(_id, callback);
    });
}

function update(data, callback) {
    var portfolio = new Portfolio(data);
    var portfolioCollection = require('../util/DBCollections').getInstance().collections.portfolio;

    portfolioCollection.update(
        {_id: portfolio._id},
        {
            $set: portfolio
        },
        callback
    );
}

function reset() {
    var portfolioCollection = require('../util/DBCollections').getInstance().collections.portfolio;
    portfolioCollection.remove({}, function() {
        return;
    });
}

var exports = {
    create: create,
    get: get,
    getList: getList,
    remove: remove,
    update: update,
    reset: reset
}

module.exports = exports;