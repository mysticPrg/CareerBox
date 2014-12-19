/**
 * Created by careerBox on 2014-11-22.
 */

var requirejs = require('../require.config');
var Member = requirejs('classes/Member');

var async = require('async');
var ObjectID = require('mongodb').ObjectID;

function create(data, callback) {
    var member = new Member(data);

    var memberCollection = require('../util/DBCollections').getInstance().collections.member;
    memberCollection.insert(member, callback);
}

function get(_id, callback) {
    var memberCollection = require('../util/DBCollections').getInstance().collections.member;

    memberCollection.findOne({'_id': new ObjectID(_id)}, callback);
}

function isExistEmail(email, isFaceboock, callback) {
    var memberCollection = require('../util/DBCollections').getInstance().collections.member;

    memberCollection.findOne({
        email: email,
        isFacebook: isFaceboock
    }, callback);
}

function remove(_id, callback) {
    var memberCollection = require('../util/DBCollections').getInstance().collections.member;

    memberCollection.remove({'_id': new ObjectID(_id)}, callback);
}

function update(data, callback) {
    var member = new Member(data);
    var memberCollection = require('../util/DBCollections').getInstance().collections.member;

    memberCollection.update(
        {_id: member._id},
        {
            $set: member
        },
        callback
    );
}

function reset() {
    var memberCollection = require('../util/DBCollections').getInstance().collections.member;
    memberCollection.remove({}, function() {
        return;
    });
}

var exports = {
    create: create,
    get: get,
    isExistEmail: isExistEmail,
    remove: remove,
    update: update,
    reset: reset
};

module.exports = exports;